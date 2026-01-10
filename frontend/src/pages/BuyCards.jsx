import { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, Columns3, ShoppingCart, X, CheckCircle, Copy } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';

const BuyCards = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCards, setSelectedCards] = useState([]);
    const [showColumnMenu, setShowColumnMenu] = useState(false);

    // API State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchasing, setPurchasing] = useState(false);

    // Purchase Result Modal
    const [purchaseResult, setPurchaseResult] = useState(null); // { success: true, product: {} }

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/products', config);
            setProducts(data.filter(p => p.type === 'card'));
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleBuy = async (productId) => {
        if (!window.confirm('Are you sure you want to buy this card?')) return;

        setPurchasing(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            const { data } = await axios.post(`http://localhost:5000/api/orders/purchase/${productId}`, {}, config);

            setPurchaseResult(data.product);
            fetchProducts(); // Refresh list to remove sold item
        } catch (err) {
            alert(err.response?.data?.message || 'Purchase failed');
        } finally {
            setPurchasing(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const filteredData = products.filter(card => {
        const matchesSearch =
            (card.bin && card.bin.includes(searchQuery)) ||
            (card.brand && card.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (card.issuer && card.issuer.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    const columns = [
        {
            key: 'bin', label: 'BIN', sortable: true,
            render: (row) => <span className="font-mono text-blue-400">{row.bin}</span>
        },
        {
            key: 'brand', label: 'Brand', sortable: true,
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{row.brand}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-dark-hover px-1 rounded">{row.type}</span>
                </div>
            )
        },
        { key: 'issuer', label: 'Bank', sortable: true },
        {
            key: 'price', label: 'Price', sortable: true,
            render: (row) => <span className="font-bold text-green-500">${row.price}</span>
        },
        {
            key: 'action', label: 'Action',
            render: (row) => (
                <button
                    onClick={() => handleBuy(row._id)}
                    disabled={purchasing}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                    {purchasing ? '...' : 'BUY'}
                </button>
            )
        }
    ];

    return (
        <div>
            {/* Purchase Success Modal */}
            {purchaseResult && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-green-500/30">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2 text-green-500">
                                <CheckCircle size={24} />
                                <h2 className="text-xl font-bold">Purchase Successful!</h2>
                            </div>
                            <button onClick={() => setPurchaseResult(null)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="bg-slate-900 rounded-xl p-4 mb-6 font-mono text-sm break-all relative group border border-slate-700">
                            <p className="text-green-400 mb-1 text-xs uppercase font-bold tracking-wider">Card Details</p>
                            <p className="text-white text-lg leading-relaxed">{purchaseResult.data}</p>
                            <button
                                onClick={() => copyToClipboard(purchaseResult.data)}
                                className="absolute top-2 right-2 p-2 bg-slate-800 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            >
                                <Copy size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-6">
                            <div>
                                <span className="block text-xs uppercase font-bold text-gray-500">BIN</span>
                                <span className="text-white">{purchaseResult.bin}</span>
                            </div>
                            <div>
                                <span className="block text-xs uppercase font-bold text-gray-500">Price Paid</span>
                                <span className="text-white">${purchaseResult.price}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setPurchaseResult(null)}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Buy Cards</h1>
                <p className="text-gray-600 dark:text-gray-400">Purchase high quality cards at the best prices.</p>
            </div>

            {/* Filter Bar (Simplified) */}
            <div className="card p-4 mb-6">
                <SearchBar
                    placeholder="Search BIN, Bank, Brand..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
            </div>

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
                    />
                )}
            </div>
        </div>
    );
};

export default BuyCards;
