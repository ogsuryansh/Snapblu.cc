import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, MessageSquare, AlertCircle, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import EmptyState from '../components/common/EmptyState';

const Tickets = () => {
    const navigate = useNavigate(); // Added hook
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Create Ticket State
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [createLoading, setCreateLoading] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/tickets', config);
            setTickets(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            await axios.post('http://localhost:5000/api/tickets', {
                subject,
                message,
                priority
            }, config);

            setShowCreateModal(false);
            setSubject('');
            setMessage('');
            fetchTickets();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create ticket');
        } finally {
            setCreateLoading(false);
        }
    };

    const columns = [
        { key: '_id', label: 'ID', render: (row) => <span className="font-mono text-xs text-gray-400">#{row._id.slice(-6)}</span> },
        {
            key: 'subject', label: 'Subject',
            render: (row) => <span className="font-bold text-gray-900 dark:text-white">{row.subject}</span>
        },
        {
            key: 'status', label: 'Status',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'Open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        row.status === 'Closed' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                    {row.status}
                </span>
            )
        },
        { key: 'priority', label: 'Priority' },
        {
            key: 'updatedAt', label: 'Last Update',
            render: (row) => <span className="text-xs text-gray-500">{new Date(row.updatedAt).toLocaleString()}</span>
        },
        {
            key: 'actions', label: 'Action',
            render: (row) => (
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/tickets/${row._id}`)}
                >
                    View
                </Button>
            )
        }
    ];

    return (
        <div>
            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold dark:text-white">Create New Ticket</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTicket} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Subject</label>
                                <input
                                    className="input-field w-full"
                                    placeholder="Briefly describe your issue..."
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Priority</label>
                                <select
                                    className="input-field w-full"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Message</label>
                                <textarea
                                    className="input-field w-full h-32"
                                    placeholder="Provide details..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <Button className="w-full" loading={createLoading}>Submit Ticket</Button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Support Tickets</h1>
                    <p className="text-gray-600 dark:text-gray-400">View your support requests or open a new one.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} icon={Plus}>New Ticket</Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-start gap-3">
                    <MessageSquare className="text-blue-500 mt-1" size={24} />
                    <div>
                        <h3 className="font-bold text-blue-900 dark:text-blue-100">Live Chat</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            For urgent issues, please use our Telegram support.
                        </p>
                    </div>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-yellow-500 mt-1" size={24} />
                    <div>
                        <h3 className="font-bold text-yellow-900 dark:text-yellow-100">Response Time</h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            Typical response time is less than 2 hours.
                        </p>
                    </div>
                </div>
            </div>

            <div className="card">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading tickets...</div>
                ) : tickets.length > 0 ? (
                    <DataTable columns={columns} data={tickets} />
                ) : (
                    <EmptyState
                        icon={MessageSquare}
                        title="No tickets yet"
                        message="You haven't created any support tickets."
                        action={<Button onClick={() => setShowCreateModal(true)}>Create Ticket</Button>}
                    />
                )}
            </div>
        </div>
    );
};

export default Tickets;
