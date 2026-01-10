import { useState } from 'react';
import { ChevronLeft, ChevronRight, Columns3 } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';

const MyOrders = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showColumnMenu, setShowColumnMenu] = useState(false);

    // Sample data (empty for now)
    const ordersData = [];

    const columns = [
        { key: 'orderId', label: 'Order ID', sortable: true },
        { key: 'baseName', label: 'Base Name', sortable: true },
        { key: 'quantity', label: 'Quantity', sortable: true },
        {
            key: 'pricePerCard',
            label: 'Price/Card',
            sortable: true,
            render: (row) => <span>${row.pricePerCard}</span>
        },
        {
            key: 'totalAmount',
            label: 'Total Amount',
            sortable: true,
            render: (row) => <span className="font-semibold">${row.totalAmount}</span>
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (row) => {
                const statusColors = {
                    completed: 'bg-green-500/10 text-green-500',
                    pending: 'bg-yellow-500/10 text-yellow-500',
                    failed: 'bg-red-500/10 text-red-500',
                };
                return (
                    <span className={`badge ${statusColors[row.status] || ''}`}>
                        {row.status}
                    </span>
                );
            },
        },
        { key: 'date', label: 'Date', sortable: true },
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                    View Details
                </button>
            ),
        },
    ];

    const totalPages = Math.ceil(ordersData.length / rowsPerPage);

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
                <p className="text-gray-400">View your purchase history</p>
            </div>

            {/* Search and Actions */}
            <div className="card p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <SearchBar
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                        className="flex-1"
                    />

                    <Button
                        variant="ghost"
                        icon={Columns3}
                        onClick={() => setShowColumnMenu(!showColumnMenu)}
                    >
                        Columns
                    </Button>
                </div>
            </div>

            {/* Column Visibility Menu */}
            {showColumnMenu && (
                <div className="card p-4 mb-4">
                    <h3 className="font-semibold text-white mb-3">Column Visibility</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {columns.map((col) => (
                            <label key={col.key} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="rounded bg-dark-bg border-dark-border text-blue-600 focus:ring-blue-600"
                                />
                                {col.label}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="card">
                <DataTable columns={columns} data={ordersData} />

                {/* Pagination */}
                <div className="border-t border-dark-border p-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Show</span>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                className="input-field py-1 px-2"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span className="text-sm text-gray-400">
                                0 of 0 row(s) selected.
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">
                                Page {ordersData.length > 0 ? currentPage : 0} of {totalPages || 1}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={currentPage === 1 || ordersData.length === 0}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={currentPage === totalPages || ordersData.length === 0}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
