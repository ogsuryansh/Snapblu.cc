import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`${API_URL}/api/tickets`, config);
            setTickets(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setLoading(false);
        }
    };

    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket.user?.username || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'closed':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
            case 'resolved':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            default:
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Support Tickets</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage user support tickets</p>
            </div>

            {/* Search */}
            <div className="card p-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by subject, status, or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field w-full"
                />
            </div>

            {/* Tickets Table */}
            <div className="card overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading tickets...</div>
                ) : filteredTickets.length === 0 ? (
                    <div className="p-12 text-center">
                        <MessageSquare size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No tickets found</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">No support tickets available.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-dark-hover border-b border-gray-200 dark:border-dark-border">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket._id} className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono text-gray-500">#{ticket._id.slice(-6)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            {ticket.user?.username || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                                            {ticket.subject}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                                            >
                                                <Eye size={16} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTickets;
