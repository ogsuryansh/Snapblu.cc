import { useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = useCallback((e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    // Close sidebar whenever the route changes
    useEffect(() => {
        closeSidebar();
    }, [location.pathname, closeSidebar]);

    return (
        <div className="flex min-h-screen bg-[#0a0a0b] dark:bg-dark-bg transition-colors">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Sidebar - Mobile */}
            <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${sidebarOpen ? 'visible' : 'invisible'}`}>
                {/* Overlay */}
                <div
                    className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={closeSidebar}
                ></div>

                {/* Sidebar Container */}
                <div className={`absolute left-0 top-0 bottom-0 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <Sidebar onClose={closeSidebar} isMobile={true} />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header onMenuToggle={toggleSidebar} />
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg py-6 px-6 transition-colors">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">●</span>
                            <span>All systems operational</span>
                        </div>
                        <span className="hidden md:block">•</span>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <span>•</span>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                            Terms of Service
                        </a>
                        <span>•</span>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                            Status
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
