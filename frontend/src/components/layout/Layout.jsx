import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Sidebar - Mobile */}
            {sidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                    <div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden">
                        <Sidebar />
                    </div>
                </>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
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
