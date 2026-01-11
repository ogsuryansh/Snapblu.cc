import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in as admin
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('adminInfo'));
        if (userInfo) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
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

            // Check if user is actually an admin
            if (!data.isAdmin) {
                setError('Access Denied: You are not an administrator.');
                setLoading(false);
                return;
            }

            // Save specifically as adminInfo to keep separate from main user login
            localStorage.setItem('adminInfo', JSON.stringify(data));

            setLoading(false);
            navigate('/admin/dashboard');
        } catch (err) {
            setLoading(false);
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : err.message
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Admin Header */}
                <div className="text-center mb-10 group">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20 group-hover:rotate-12 transition-all duration-500">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m13 2-2 10h9L7 22l2-10H1L13 2z" fill="currentColor" /></svg>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Snap Blu CC</h1>
                    <p className="text-blue-200/40 text-[11px] uppercase tracking-[0.3em] font-bold mt-2">Administrative Core</p>
                </div>

                <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                            <ShieldAlert size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                                placeholder="admin@snapblu.cc"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                                placeholder="••••••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>Processing...</>
                            ) : (
                                <>Authenticate Access</>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8 text-slate-700 text-[10px] uppercase font-bold tracking-[0.2em]">
                    <p>Protected by Snap Blu CC Security Systems v2.4</p>
                    <p className="mt-1 opacity-50 underline decoration-blue-500/50">Restricted Area: Authorized Personnel Only</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
