import { useState } from 'react';
import { Plus, MessageSquare, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import EmptyState from '../components/common/EmptyState';

const Tickets = () => {
    // Mock Data
    const [tickets, setTickets] = useState([
        { id: 'T-1023', subject: 'Deposit not credited', status: 'Open', lastUpdate: '2 mins ago', priority: 'High' },
        { id: 'T-0988', subject: 'Question about checking', status: 'Closed', lastUpdate: '2 days ago', priority: 'Low' },
    ]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const columns = [
        { key: 'id', label: 'ID', sortable: true },
        {
            key: 'subject',
            label: 'Subject',
            render: (row) => (
                <div className="font-medium text-gray-900 dark:text-white">
                    {row.subject}
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Open'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                    {row.status}
                </span>
            )
        },
        { key: 'priority', label: 'Priority' },
        { key: 'lastUpdate', label: 'Last Update', sortable: true },
        {
            key: 'actions',
            label: 'Actions',
            render: () => (
                <Button variant="outline" size="sm">View</Button>
            )
        }
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Support Tickets</h1>
                    <p className="text-gray-600 dark:text-gray-400">Need help? Create a ticket and our team will assist you.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
                    <Plus size={18} />
                    New Ticket
                </Button>
            </div>

            {/* Quick Stats or Alerts */}
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

            {/* Content */}
            {tickets.length > 0 ? (
                <DataTable columns={columns} data={tickets} />
            ) : (
                <EmptyState
                    icon={MessageSquare}
                    title="No tickets yet"
                    message="You haven't created any support tickets."
                    action={
                        <Button onClick={() => setShowCreateModal(true)}>
                            Create your first ticket
                        </Button>
                    }
                />
            )}
        </div>
    );
};

export default Tickets;
