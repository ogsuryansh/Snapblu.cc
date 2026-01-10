import { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, Columns3, ShoppingCart } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';

const BuyCards = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBase, setSelectedBase] = useState('all');
    const [selectedCards, setSelectedCards] = useState([]);
    const [showColumnMenu, setShowColumnMenu] = useState(false);

    // API State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                // Fetch all products, filter for 'card' type on frontend or backend
                const { data } = await axios.get('http://localhost:5000/api/products', config);
                // Filter only cards
                const cardsOnly = data.filter(p => p.type === 'card');
                setProducts(cardsOnly);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter Logic
    const filteredData = products.filter(card => {
        const matchesSearch =
            (card.bin && card.bin.includes(searchQuery)) ||
            (card.brand && card.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (card.issuer && card.issuer.toLowerCase().includes(searchQuery.toLowerCase()));

        // const matchesBase = selectedBase === 'all' || card.base === selectedBase; // Base not yet in DB
        return matchesSearch;
    });

    const columns = [
        {
            key: 'bin',
            label: 'BIN',
            sortable: true,
            render: (row) => <span className="font-mono text-blue-400">{row.bin}</span>
        },
        {
            key: 'brand',
            label: 'Brand',
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{row.brand}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-dark-hover px-1 rounded">{row.type}</span>
                </div>
            )
        },
        { key: 'issuer', label: 'Bank', sortable: true },
        {
            key: 'price',
            label: 'Price',
            sortable: true,
            render: (row) => <span className="font-bold text-green-500">${row.price}</span>
        },
        {
            key: 'action',
            label: 'Action',
            render: (row) => (
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95">
                    BUY
                </button>
            )
        }
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Buy Cards</h1>
                <p className="text-gray-600 dark:text-gray-400">Purchase high quality cards at the best prices.</p>
            </div>

            {/* Filters and Search */}
            <div className="card p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <SearchBar
                        placeholder="Search BIN, Bank, Brand..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                        className="flex-1"
                    />

                    <div className="flex gap-3">
                        <Button variant="secondary" icon={Filter}>
                            Filters
                        </Button>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                    <Button
                        variant="secondary"
                        icon={ShoppingCart}
                        disabled={selectedCards.length === 0}
                    >
                        Buy Selected ({selectedCards.length})
                    </Button>

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
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Column Visibility</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {columns.map((col) => (
                            <label key={col.key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="rounded bg-white dark:bg-dark-bg border-gray-300 dark:border-dark-border text-blue-600 focus:ring-blue-600"
                                />
                                {col.label}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="card">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading inventory...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        selectable
                        onSelectionChange={setSelectedCards}
                    />
                )}
            </div>
        </div>
    );
};

export default BuyCards;
