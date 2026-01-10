import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, User, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';
import API_URL from '../config/api';

const TicketDetails = () => {
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
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
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
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

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

    if (loading) return <div className="p-8 text-center">Loading ticket...</div>;
    if (!ticket) return <div className="p-8 text-center text-red-500">Ticket not found</div>;

    return (
        <div className="max-w-4xl mx-auto h-[cal(100vh-100px)] flex flex-col">
            <button
                onClick={() => navigate('/tickets')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Tickets
            </button>

            {/* Ticket Header */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-t-xl border-b border-gray-100 dark:border-slate-700">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.subject}</h1>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${ticket.status === 'Open' ? 'bg-green-100 text-green-700' :
                                'bg-blue-100 text-blue-700'
                                }`}>
                                {ticket.status}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono">ID: #{ticket._id}</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-gray-50 dark:bg-slate-900 overflow-y-auto p-6 space-y-6">
                {ticket.messages.map((msg, idx) => {
                    const isAdmin = msg.sender === 'Admin';
                    return (
                        <div key={idx} className={`flex gap-4 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAdmin ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                                }`}>
                                {isAdmin ? <ShieldCheck size={16} /> : <User size={16} />}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl p-4 ${isAdmin
                                ? 'bg-red-50 dark:bg-red-900/20 text-gray-900 dark:text-gray-100 rounded-tr-none'
                                : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm rounded-tl-none'
                                }`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-gray-500">{msg.sender}</span>
                                    <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-b-xl border-t border-gray-100 dark:border-slate-700">
                <form onSubmit={handleReply} className="flex gap-4">
                    <input
                        className="flex-1 bg-gray-100 dark:bg-slate-900 border-0 rounded-xl px-4 focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your reply..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                    />
                    <Button
                        disabled={replying || !reply.trim()}
                        icon={Send}
                        className="rounded-xl px-6"
                    >
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default TicketDetails;
