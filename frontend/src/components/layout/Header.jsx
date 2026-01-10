import { Link } from 'react-router-dom';
import { Sun, Moon, Plus, User, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Header = ({ onMenuToggle }) => {
    const { isDark, toggleTheme } = useTheme();
    const balance = 0.0;

    return (
        <header className="bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border sticky top-0 z-40 transition-colors">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                >
                    <Menu size={20} />
                </button>

                {/* Spacer for desktop */}
                <div className="hidden lg:block"></div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Balance Display */}
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-lg px-4 py-2">
                        <span className="text-gray-900 dark:text-white font-semibold">${balance.toFixed(2)}</span>
                        <Link to="/deposit" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <Plus size={16} />
                        </Link>
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? (
                            <Sun size={20} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />
                        ) : (
                            <Moon size={20} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />
                        )}
                    </button>

                    {/* User Avatar */}
                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:opacity-80 transition-opacity">
                        <User size={20} className="text-white" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
