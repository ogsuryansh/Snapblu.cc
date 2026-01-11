import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    ShoppingCart,
    CreditCard,
    Package,
    FileText,
    ShoppingBag,
    FileStack,
    Layers,
    Search,
    ShieldCheck,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Settings,
    Key,
    MoreVertical,
    LogOut,
    Activity,
    Plus
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Sidebar = ({ onClose }) => {
    const location = useLocation();

    // Layout now handles closing on route change to prevent mount-time flicker
    /* 
    useEffect(() => {
        if (onClose) onClose();
    }, [location.pathname]);
    */
    const [openMenus, setOpenMenus] = useState({
        shop: true,
        orders: true,
        tools: true,
        settings: true,
    });
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);
    const navigate = useNavigate();

    // Get user info
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {
        username: 'Guest',
        email: 'guest@example.com'
    };

    // Initial (e.g. SU for S9..)
    const userInitials = userInfo.username
        ? userInfo.username.substring(0, 2).toUpperCase()
        : 'GU';

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
    };

    const isActive = (path) => location.pathname === path;

    // ... (Navigation objects kept same)

    const navigation = [
        {
            section: 'Navigation',
            items: [
                { name: 'Home', icon: Home, path: '/dashboard' },
            ],
        },
        {
            section: 'Shopping',
            key: 'shop',
            collapsible: true,
            icon: ShoppingCart,
            items: [
                { name: 'Buy Cards', icon: CreditCard, path: '/buy-cards' },
                { name: 'Bulk Cards', icon: Package, path: '/bulk-cards' },
                { name: 'Buy Logs', icon: FileText, path: '/buy-logs' },
            ],
        },
        {
            section: 'My Orders',
            key: 'orders',
            collapsible: true,
            icon: ShoppingBag,
            items: [
                { name: 'My Orders', icon: FileStack, path: '/my-orders' },
                { name: 'My Card Orders', icon: CreditCard, path: '/my-card-orders' },
                { name: 'My Log Orders', icon: FileText, path: '/my-log-orders' },
                { name: 'My Bulk Card Purchases', icon: Layers, path: '/my-bulk-purchases' },
            ],
        },
        {
            section: 'Tools',
            key: 'tools',
            collapsible: true,
            icon: Search,
            items: [
                { name: 'Checkers', icon: ShieldCheck, path: '/checkers' },
            ],
        },
        {
            section: 'Finance',
            key: 'finance',
            collapsible: true,
            icon: CreditCard,
            items: [
                { name: 'Deposit Money', icon: CreditCard, path: '/deposit' },
                { name: 'My Deposits', icon: FileText, path: '/my-deposits' },
                { name: 'Transactions', icon: Activity, path: '/transactions' },
            ],
        },
        {
            section: 'Support',
            key: 'support',
            collapsible: false,
            items: [
                { name: 'Tickets', icon: FileText, path: '/tickets' },
            ],
        },
        {
            section: 'Settings',
            key: 'settings',
            collapsible: true,
            icon: Settings,
            items: [
                { name: 'Change Password', icon: Key, path: '/change-password' },
            ],
        },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-dark-bg border-r border-gray-200 dark:border-dark-border h-screen sticky top-0 flex flex-col transition-colors z-30">
            <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
                {/* Brand Logo - Snap Blu CC */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <ShoppingBag size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tighter text-gray-900 dark:text-white uppercase">
                        Snap Blu CC
                    </h1>
                </div>

                {/* User Info Top */}
                <div className="mb-6 bg-gray-50 dark:bg-dark-card/50 p-3 rounded-xl border border-gray-100 dark:border-dark-border">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">
                            {userInitials}
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                                {userInfo.email ? userInfo.email.split('@')[0] : 'Guest'}
                            </h2>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        Status: <span className="text-green-500 font-bold">Verified</span>
                    </p>
                </div>

                {/* Topup Button CTA */}
                <Link
                    to="/deposit"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-2.5 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5 active:scale-95 group"
                >
                    <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
                        <Plus size={14} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Top Up</span>
                </Link>

                {/* Navigation */}
                <nav className="space-y-6">
                    {navigation.map((section, idx) => (
                        <div key={idx}>
                            {section.collapsible ? (
                                <div>
                                    <button
                                        onClick={() => toggleMenu(section.key)}
                                        className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-3 hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {section.icon && <section.icon size={14} />}
                                            <span>{section.section}</span>
                                        </div>
                                        {openMenus[section.key] ? (
                                            <ChevronDown size={14} />
                                        ) : (
                                            <ChevronRight size={14} />
                                        )}
                                    </button>
                                    {openMenus[section.key] && (
                                        <div className="space-y-1 ml-2">
                                            {section.items.map((item) => (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={onClose}
                                                    className={`sidebar-link ${isActive(item.path) ? 'active' : ''
                                                        }`}
                                                >
                                                    <item.icon size={16} />
                                                    <span className="text-xs">{item.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2">
                                        {section.section}
                                    </h3>
                                    <div className="space-y-0.5">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={onClose}
                                                className={`sidebar-link ${isActive(item.path) ? 'active' : ''
                                                    }`}
                                            >
                                                <item.icon size={16} />
                                                <span className="text-xs">{item.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Bottom Profile Section */}
            <div className="p-3 border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg relative transition-colors" ref={profileMenuRef}>
                {/* Popup Menu */}
                {showProfileMenu && (
                    <div className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-3 border-b border-gray-200 dark:border-dark-border">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
                                    {userInitials}
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{userInfo.username}</h4>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{userInfo.email}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                            <LogOut size={14} />
                            Log out
                        </button>
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-gray-100 dark:bg-dark-card rounded-lg p-2.5 flex items-center justify-between group transition-colors">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                            {userInitials}
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                {userInfo.email ? userInfo.email.split('@')[0] : 'Guest'}
                            </h4>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">Online</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
