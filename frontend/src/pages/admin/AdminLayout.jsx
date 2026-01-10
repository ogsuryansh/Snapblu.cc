import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, LayoutDashboard, LogOut, Package, CreditCard, Ticket } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('adminInfo');
        navigate('/admin/login');
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Deposits', path: '/admin/deposits', icon: CreditCard },
        { name: 'Tickets', path: '/admin/tickets', icon: Ticket },
    ];

    return (
        <div className="min-h-screen bg-slate-900 flex text-slate-100">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r border-slate-700 bg-slate-900 fixed h-full z-10 flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Snapblu Admin
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
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

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/10 w-full transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Admin Content */}
            <main className="flex-1 ml-64 bg-[#0f172a] min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
