import { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Users,
    LayoutDashboard,
    LogOut,
    Package,
    CreditCard,
    Ticket,
    Settings,
    Menu,
    X,
    ShoppingBag
} from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Memoize close function to prevent unnecessary re-renders
    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    // Memoize toggle with delay to prevent race condition
    const toggleMobileMenu = useCallback((e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        // Small delay to ensure click doesn't propagate to overlay
        setTimeout(() => {
            setIsMobileMenuOpen(prev => !prev);
        }, 0);
    }, []);

    // Auto-close sidebar on route change
    useEffect(() => {
        closeMobileMenu();
    }, [location.pathname, closeMobileMenu]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem('adminInfo');
        navigate('/admin/login');
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Deposits', path: '/admin/deposits', icon: CreditCard },
        { name: 'Tickets', path: '/admin/tickets', icon: Ticket },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col md:flex-row">

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between px-4 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-[100]">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <ShoppingBag size={18} className="text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Snap Blu CC Admin
                    </span>
                </div>
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 text-slate-300 hover:text-white active:scale-95 transition-transform"
                    type="button"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay - Only clickable after menu is fully open */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
                    onClick={closeMobileMenu}
                    onTouchEnd={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 z-[95] transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 flex flex-col h-screen
            `}>
                <div className="p-6 hidden md:flex items-center gap-3 border-b border-slate-800/50">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <ShoppingBag size={24} className="text-white" />
                    </div>
                    <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Snap Blu CC Admin
                    </span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${isActive(item.path)
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <item.icon size={20} className={isActive(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 w-full transition-colors group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden pt-0 md:pt-0">
                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
