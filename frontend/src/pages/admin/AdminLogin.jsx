import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert } from 'lucide-react';
import axios from 'axios';

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
                'http://localhost:5000/api/users/login',
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
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/20">
                        <Lock size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
                    <p className="text-blue-200/60 text-sm mt-2">Restricted Access Area</p>
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

                <div className="text-center mt-8 text-slate-600 text-xs">
                    <p>Protected by Snapblu Security Systems v1.0</p>
                    <p className="mt-1">Unauthorized access attempts will be logged.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
