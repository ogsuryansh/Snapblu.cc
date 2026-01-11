import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, LayoutDashboard, LogOut, Package, CreditCard, Ticket, Settings, Menu, X, ShoppingBag } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('adminInfo');
        navigate('/admin/login');
    };

    const isActive = (path) => location.pathname === path;
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
        <div className="min-h-screen bg-[#0f172a] flex text-slate-100 relative">

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 w-full bg-slate-900 border-b border-slate-700 z-[60] px-4 py-3 flex items-center justify-between">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Snapblu Admin
                </h1>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMobileMenuOpen(!isMobileMenuOpen);
                    }}
                    className="text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-md transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-700 z-50 transform transition-transform duration-200 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                flex flex-col h-full
            `}>
                <div className="p-6 hidden md:block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Snapblu Admin
                    </h1>
                </div>

                <div className="p-4 md:hidden border-b border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-400">Menu</span>
                    <button onClick={closeMobileMenu}><X size={20} className="text-slate-400" /></button>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4 md:mt-0 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/10 w-full transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full md:w-auto min-h-screen bg-[#0f172a] pt-16 md:pt-0 overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
