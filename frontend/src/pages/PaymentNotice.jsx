import { useEffect } from 'react';
import { AlertCircle, Mail, ExternalLink } from 'lucide-react';

const PaymentNotice = () => {
    // Force logout by clearing all stored authentication data
    useEffect(() => {
        // Clear localStorage
        localStorage.clear();
        // Clear sessionStorage
        sessionStorage.clear();
        // Also specifically target common auth keys
        ['token', 'user', 'userInfo', 'adminToken', 'adminInfo'].forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
            <div
                className="max-w-2xl w-full animate-fade-in"
            >
                <div className="bg-gray-800/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-12 h-12 text-yellow-500" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
                        Payment Notice
                    </h1>

                    {/* Main Message */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-6">
                        <p className="text-lg text-yellow-100 text-center leading-relaxed mb-3">
                            The payment for this website to the developer has not been completed yet.
                        </p>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-4">
                            <p className="text-base text-red-100 text-center leading-relaxed">
                                <span className="font-semibold">Site Owner:</span> <a href="https://t.me/blucards2" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">@blucards2</a>
                            </p>
                            <p className="text-base text-red-100 text-center leading-relaxed mt-2">
                                has not made payment to the developer <a href="https://t.me/iamseller0" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">@iamseller0</a>
                            </p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4 mb-6">
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-purple-400" />
                                Contact Information
                            </h3>
                            <p className="text-gray-300 text-sm">
                                Please contact the administrator to resolve this payment issue and restore full access to the website.
                            </p>
                        </div>

                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-2">Current Status</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-500 mt-1">•</span>
                                    <span>Limited functionality available</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-500 mt-1">•</span>
                                    <span>Full access pending payment completion</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-500 mt-1">•</span>
                                    <span>Contact support for immediate assistance</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center">
                        <a
                            href="https://t.me/iamseller0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Mail className="w-5 h-5" />
                            Contact Support on Telegram
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Footer Note */}
                    <p className="text-center text-gray-400 text-sm mt-6">
                        This is a temporary notice. Thank you for your patience.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentNotice;
