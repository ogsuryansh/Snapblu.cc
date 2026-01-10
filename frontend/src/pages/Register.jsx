import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config/api';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            await axios.post(
                `${API_URL}/api/users`,
                { username, email, password },
                config
            );

            setSuccess(true);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.response && err.response.data.message
                ? err.response.data.message
                : err.message);
        }
    };

    // If registration is successful, show the success state
    if (success) {
        return (
            <div className="min-h-screen w-full flex bg-black text-white items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#111] border border-[#333] rounded-2xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                        <Mail size={40} className="text-green-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                        <p className="text-gray-400">
                            We've sent a verification link to <span className="text-white font-medium">{email}</span>.
                        </p>
                        <p className="text-gray-400 mt-2">
                            Please check your inbox (and spam folder) to activate your account.
                        </p>
                    </div>
                    <Link
                        to="/login"
                        className="block w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Return to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex bg-black text-white">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-20 relative z-10">
                <div className="max-w-md w-full mx-auto space-y-8">
                    {/* Logo Mobile */}
                    <div className="flex items-center gap-2 lg:hidden font-bold text-2xl mb-8">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <ShieldCheck size={20} className="text-white" />
                        </div>
                        <span>Snapblu.cc</span>
                    </div>

                    {/* Logo Desktop (Top Left absolute) */}
                    <div className="hidden lg:flex absolute top-8 left-8 items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <ShieldCheck size={20} className="text-white" />
                        </div>
                        <span>Snapblu.cc</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                        <p className="text-gray-400">Enter your details below to create your account</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>

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
                                    placeholder="Create a password"
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

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Cloudflare Mock */}
                        <div className="bg-[#1a1a1a] border border-[#333] rounded-md p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="checkbox-wrapper">
                                    <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center">
                                        {/* Mock spinner or check */}
                                    </div>
                                </div>
                                <span className="text-sm text-gray-300">Verify you are human</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <ShieldCheck size={24} className="text-gray-500" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <div className="text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium underline-offset-4 hover:underline">
                                Login
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
                            "Join the most secure and advanced platform for your digital needs."
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

export default Register;
