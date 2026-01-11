import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config/api';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                `${API_URL}/api/users/login`,
                { email, password },
                config
            );

            // Save user info and token to localStorage
            localStorage.setItem('userInfo', JSON.stringify(data));

            // Redirect to dashboard
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setLoading(false);
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : err.message
            );
        }
    };

    const handleVerify = () => {
        if (isVerified || isVerifying) return;
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerified(true);
            setIsVerifying(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex bg-black text-white">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-20 relative z-10">
                <div className="max-w-md w-full mx-auto space-y-8">
                    {/* Logo Mobile */}
                    <div className="flex items-center gap-3 lg:hidden mb-8 group cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m13 2-2 10h9L7 22l2-10H1L13 2z" fill="currentColor" /></svg>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">ZENITH</span>
                    </div>

                    {/* Logo Desktop */}
                    <div className="hidden lg:flex absolute top-8 left-8 items-center gap-3 font-bold group cursor-pointer">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m13 2-2 10h9L7 22l2-10H1L13 2z" fill="currentColor" /></svg>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white">ZENITH</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Login to your account</h1>
                        <p className="text-gray-400">Enter your email below to login to your account</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-5 h-5 border border-gray-600 rounded bg-[#111] peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                                    <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none" />
                                </div>
                                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                            </label>
                            <Link to="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                Forgot password
                            </Link>
                        </div>

                        {/* Interactive Cloudflare Mock */}
                        <div
                            onClick={handleVerify}
                            className={`bg-[#1a1a1a] border border-[#333] rounded-md p-4 flex items-center justify-between cursor-pointer select-none transition-colors ${!isVerified && 'hover:bg-[#222]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="checkbox-wrapper">
                                    <div className={`w-7 h-7 border-2 rounded flex items-center justify-center transition-all ${isVerified
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-gray-500 bg-transparent'
                                        }`}>
                                        {isVerifying ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : isVerified ? (
                                            <CheckCircle2 size={18} className="text-white" />
                                        ) : null}
                                    </div>
                                </div>
                                <span className="text-sm text-gray-300">
                                    {isVerified ? 'Success!' : isVerifying ? 'Verifying...' : 'Verify you are human'}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <ShieldCheck size={24} className="text-gray-500" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isVerified}
                            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Login"
                            )}
                        </button>

                        <div className="text-center text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium underline-offset-4 hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </form>

                    <div className="pt-8 flex items-center justify-center gap-6 text-xs text-gray-500 border-t border-[#222]">
                        <Link to="#" className="hover:text-gray-300">Privacy Policy</Link>
                        <span>•</span>
                        <Link to="#" className="hover:text-gray-300">Terms of Service</Link>
                        <span>•</span>
                        <Link to="#" className="hover:text-gray-300">Status</Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] relative items-center justify-center overflow-hidden border-l border-[#222]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20"></div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-lg text-center p-8">
                    {/* Big Abstract Logo */}
                    <div className="w-48 h-48 mx-auto mb-12 relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                        <div className="relative w-full h-full bg-gradient-to-br from-[#111] to-[#000] border border-[#333] rounded-3xl flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <ShieldCheck size={80} className="text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        </div>
                    </div>

                    <blockquote className="space-y-4">
                        <p className="text-2xl font-medium text-gray-200 leading-relaxed">
                            "Security and reliability are not just features, they are our promise."
                        </p>
                        <footer className="text-gray-500 text-sm font-medium uppercase tracking-widest">
                            — Snapblu.cc
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>
    );
};

export default Login;
