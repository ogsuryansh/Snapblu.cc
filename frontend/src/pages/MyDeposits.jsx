import DataTable from '../components/common/DataTable';
import EmptyState from '../components/common/EmptyState';

const MyDeposits = () => {
    // Mock data
    const deposits = [];

    const columns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'method', label: 'Method', sortable: true },
        { key: 'amount', label: 'Amount', sortable: true },
        { key: 'status', label: 'Status' },
        { key: 'date', label: 'Date', sortable: true },
        { key: 'actions', label: 'Actions' },
    ];

    if (deposits.length === 0) {
        return <EmptyState
            title="No deposits found"
            message="You haven't made any deposits yet."
        />;
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Deposits</h1>
                <p className="text-gray-600 dark:text-gray-400">View your deposit history</p>
            </div>
            <DataTable columns={columns} data={deposits} />
        </div>
    );
};

export default MyDeposits;
