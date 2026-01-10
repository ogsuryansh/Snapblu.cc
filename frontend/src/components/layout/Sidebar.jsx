import { Link, useLocation } from 'react-router-dom';
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
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Settings,
    Key,
    MoreVertical,
    LogOut,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({
        shop: true,
        orders: true,
        tools: true,
        settings: true,
    });
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);

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
                { name: 'Bin Checker', icon: Search, path: '/bin-checker' },
                { name: 'Card Checker', icon: CheckCircle, path: '/card-checker' },
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
                {/* User Info Top */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            S9
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">S9177087</h2>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        Welcome back 👋
                    </p>
                </div>

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
                                                    className={`sidebar-link ${isActive(item.path) ? 'active' : ''
                                                        }`}
                                                >
                                                    <item.icon size={18} />
                                                    <span className="text-sm">{item.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-3">
                                        {section.section}
                                    </h3>
                                    <div className="space-y-1">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`sidebar-link ${isActive(item.path) ? 'active' : ''
                                                    }`}
                                            >
                                                <item.icon size={18} />
                                                <span className="text-sm">{item.name}</span>
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
            <div className="p-4 border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg relative transition-colors" ref={profileMenuRef}>
                {/* Popup Menu */}
                {showProfileMenu && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-gray-200 dark:border-dark-border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    S9
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">S9177087</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">s9177087@gmail.com</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                            <LogOut size={18} />
                            Log out
                        </button>
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-gray-100 dark:bg-dark-card rounded-xl p-3 flex items-center justify-between group transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            S9
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">S9177087</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">s9177087@gmail.com</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
