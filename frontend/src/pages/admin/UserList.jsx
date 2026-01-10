import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Shield, ShieldAlert } from 'lucide-react';
import API_URL from '../../config/api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const config = {
                    headers: {
                        Authorization: `Bearer ${adminInfo.token}`,
                    },
                };

                const { data } = await axios.get(`${API_URL}/api/users`, config);
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <div className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-4 py-2 rounded-lg text-sm font-medium">
                    Total Users: {users.length}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-500">Loading users...</div>
            ) : error ? (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/20">
                    {error}
                </div>
            ) : (
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-slate-700 text-xs uppercase text-slate-400">
                                    <th className="px-6 py-4 font-semibold">ID</th>
                                    <th className="px-6 py-4 font-semibold">User</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Admin</th>
                                    <th className="px-6 py-4 font-semibold">Balance</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-700/50 transition-colors text-sm text-slate-300">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                            {user._id.substring(user._id.length - 6)}
                                        </td>
                                        <td className="px-6 py-4 font-medium">{user.username}</td>
                                        <td className="px-6 py-4">
                                            <a href={`mailto:${user.email}`} className="text-blue-400 hover:text-blue-300">
                                                {user.email}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isAdmin ? (
                                                <span className="flex items-center gap-1 text-green-400 bg-green-500/10 px-2 py-1 rounded text-xs font-bold w-fit border border-green-500/20">
                                                    <Shield size={12} /> Admin
                                                </span>
                                            ) : (
                                                <span className="text-slate-500 text-xs">User</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono font-medium text-slate-200">
                                            ${user.balance.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                                                    <ShieldAlert size={16} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
