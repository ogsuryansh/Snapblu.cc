import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, User, ShieldCheck, X } from 'lucide-react';
import API_URL from '../../config/api';

const AdminTicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [replying, setReplying] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchTicket();
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket]);

    const fetchTicket = async () => {
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
            const { data } = await axios.get(`${API_URL}/api/tickets/${id}`, config);
            setTicket(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;

        setReplying(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };

            const { data } = await axios.post(`${API_URL}/api/tickets/${id}/reply`, {
                message: reply
            }, config);

            setTicket(data);
            setReply('');
        } catch (error) {
            alert('Failed to send reply');
        } finally {
            setReplying(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            if (!adminInfo || !adminInfo.token) {
                alert('Admin authentication required. Please login again.');
                navigate('/admin/login');
                return;
            }

            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };

            const { data } = await axios.put(`${API_URL}/api/tickets/${id}`, {
                status: newStatus
            }, config);

            setTicket(data);
            alert(`Ticket status updated to: ${newStatus}`);
        } catch (error) {
            console.error('Status update error:', error.response || error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to update status';
            alert(`Error: ${errorMsg}`);
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Loading ticket...</div>;
    if (!ticket) return <div className="p-8 text-center text-red-500">Ticket not found</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <button
                onClick={() => navigate('/admin/tickets')}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Tickets
            </button>

            {/* Ticket Header */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-white">{ticket.subject}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${ticket.status === 'Open' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                ticket.status === 'Answered' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                }`}>
                                {ticket.status}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            User: <span className="text-white font-medium">{ticket.user?.username}</span>
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-1">ID: #{ticket._id}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleStatusChange('Open')}
                            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                        >
                            Mark Open
                        </button>
                        <button
                            onClick={() => handleStatusChange('Closed')}
                            className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                        >
                            Close Ticket
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 mb-6 max-h-[600px] overflow-y-auto space-y-4"
                style={{ scrollBehavior: 'smooth' }}>
                {ticket.messages.map((msg, idx) => {
                    const isAdmin = msg.sender === 'Admin';
                    return (
                        <div key={idx} className={`flex gap-4 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isAdmin ? 'bg-red-600' : 'bg-blue-600'
                                }`}>
                                {isAdmin ? <ShieldCheck size={20} /> : <User size={20} />}
                            </div>
                            <div className={`max-w-[70%] rounded-2xl p-4 ${isAdmin
                                ? 'bg-red-500/10 border border-red-500/30 rounded-tr-none'
                                : 'bg-slate-800 border border-slate-700 rounded-tl-none'
                                }`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs font-bold ${isAdmin ? 'text-red-400' : 'text-blue-400'}`}>
                                        {msg.sender}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-white whitespace-pre-wrap">{msg.message}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <form onSubmit={handleReply} className="flex gap-4">
                    <input
                        className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Type your reply as admin..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={replying || !reply.trim()}
                        className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
                    >
                        <Send size={18} />
                        Send Reply
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminTicketDetails;
