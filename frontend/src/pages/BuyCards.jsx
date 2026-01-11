import { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, Columns3, ShoppingCart, X, CheckCircle, Copy, ShieldCheck, RefreshCw, CheckSquare, AlertCircle } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import API_URL from '../config/api';

const BuyCards = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCards, setSelectedCards] = useState([]);
    const [showColumnMenu, setShowColumnMenu] = useState(false);

    // API State
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [purchasing, setPurchasing] = useState(false);
    const [checkingId, setCheckingId] = useState(null);
    const [checkResults, setCheckResults] = useState({}); // { id: 'LIVE' | 'DEAD' }

    // Purchase Result Modal
    const [purchaseResult, setPurchaseResult] = useState(null); // { success: true, product: {} | products: [] }

    // Confirmation Modal State
    const [confirmPurchase, setConfirmPurchase] = useState(null); // { items: [], total: 0 }

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (pageNum = 1) => {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`${API_URL}/api/products?type=card&limit=100&page=${pageNum}`, config);

            const newProducts = data.products || [];
            if (pageNum === 1) {
                setProducts(newProducts);
            } else {
                setProducts(prev => [...(Array.isArray(prev) ? prev : []), ...newProducts]);
            }

            setHasMore(data.page < data.pages);
            setPage(data.page);
            setLoading(false);
            setLoadingMore(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchProducts(page + 1);
        }
    };

    const handleBuy = async (productId) => {
        const product = products.find(p => p._id === productId);
        if (!product) return;
        setConfirmPurchase({ items: [product], total: product.price });
    };

    const processPurchase = async (items) => {
        setPurchasing(true);
        setConfirmPurchase(null);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            if (items.length === 1) {
                const { data } = await axios.post(`${API_URL}/api/orders/purchase/${items[0]._id}`, {}, config);
                setPurchaseResult([data.product]);
            } else {
                const productIds = items.map(c => c._id);
                const { data } = await axios.post(`${API_URL}/api/orders/purchase-batch`, { productIds }, config);
                setPurchaseResult(data.products);
            }

            fetchProducts();
            setSelectedCards([]);
        } catch (err) {
            alert(err.response?.data?.message || 'Purchase failed');
        } finally {
            setPurchasing(false);
        }
    };

    const handleBulkBuy = async () => {
        if (selectedCards.length === 0) return;
        const total = selectedCards.reduce((sum, p) => sum + p.price, 0);
        setConfirmPurchase({ items: selectedCards, total });
    };

    const handleCheck = async (productId) => {
        setCheckingId(productId);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post(`${API_URL}/api/products/check-card`, { id: productId }, config);

            setCheckResults(prev => ({
                ...prev,
                [productId]: data.status
            }));
        } catch (err) {
            alert(err.response?.data?.message || 'Check failed');
        } finally {
            setCheckingId(null);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const filteredData = (Array.isArray(products) ? products : []).filter(card => {
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
            key: 'status', label: 'Status',
            render: (row) => {
                const status = checkResults[row._id];
                if (status === 'LIVE') return <span className="badge bg-green-500/10 text-green-500 border border-green-500/20">LIVE</span>;
                if (status === 'DEAD') return <span className="badge bg-red-500/10 text-red-500 border border-red-500/20">DEAD</span>;
                return <span className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">UNCHECKED</span>;
            }
        },
        {
            key: 'price', label: 'Price', sortable: true,
            render: (row) => <span className="font-bold text-green-500">${row.price}</span>
        },
        {
            key: 'action', label: 'Action',
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleCheck(row._id)}
                        disabled={checkingId === row._id || !!checkResults[row._id]}
                        className={`p-2 rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95 ${checkResults[row._id]
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-slate-800 hover:bg-slate-700 text-blue-400'
                            }`}
                        title="Check Card"
                    >
                        {checkingId === row._id ? (
                            <RefreshCw size={18} className="animate-spin" />
                        ) : (
                            <ShieldCheck size={18} />
                        )}
                    </button>
                    <button
                        onClick={() => handleBuy(row._id)}
                        disabled={purchasing}
                        className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500 text-white p-2 rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95"
                        title="Buy Card"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="relative">
            {/* Confirmation Modal */}
            {confirmPurchase && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.2)] max-w-md w-full p-8 border border-blue-500/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                                <AlertCircle size={32} className="text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Confirm Purchase</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Please review your order details below.</p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-700/50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Item Count</span>
                                <span className="text-lg font-bold text-slate-900 dark:text-white px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg">{confirmPurchase.items.length} {confirmPurchase.items.length === 1 ? 'Card' : 'Cards'}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Price</span>
                                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">${confirmPurchase.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setConfirmPurchase(null)}
                                className="px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => processPurchase(confirmPurchase.items)}
                                className="px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 transform hover:-translate-y-0.5"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Purchase Success Modal */}
            {purchaseResult && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-green-500/30">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2 text-green-500">
                                <CheckCircle size={24} />
                                <h2 className="text-xl font-bold">Purchase Successful!</h2>
                            </div>
                            <button onClick={() => setPurchaseResult(null)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto mb-6 pr-2">
                            {purchaseResult.map((p, idx) => (
                                <div key={p._id || idx} className="bg-slate-900 rounded-xl p-4 font-mono text-sm break-all relative group border border-slate-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-green-400 text-[10px] uppercase font-bold tracking-wider">Card #{idx + 1} ({p.bin})</p>
                                        <button
                                            onClick={() => copyToClipboard(p.data)}
                                            className="p-1.5 bg-slate-800 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                    <p className="text-white text-sm leading-relaxed">{p.data}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl mb-6 border border-slate-200 dark:border-slate-700">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Total Items</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{purchaseResult.length}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase font-bold">Total Paid</p>
                                <p className="text-lg font-bold text-green-500">${purchaseResult.reduce((sum, p) => sum + p.price, 0).toFixed(2)}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setPurchaseResult(null)}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-green-900/20"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Buy Cards</h1>
                    <p className="text-gray-600 dark:text-gray-400">Purchase high quality cards at the best prices.</p>
                </div>
                {selectedCards.length > 0 && (
                    <button
                        onClick={handleBulkBuy}
                        disabled={purchasing}
                        className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 animate-in slide-in-from-right transition-all transform hover:scale-105 active:scale-95"
                    >
                        {purchasing ? (
                            <RefreshCw size={20} className="animate-spin" />
                        ) : (
                            <CheckSquare size={20} />
                        )}
                        Buy Selected ({selectedCards.length})
                    </button>
                )}
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
            <div className="card mb-8">
                {loading ? (
                    <div className="p-20 text-center flex flex-col items-center">
                        <RefreshCw size={40} className="animate-spin text-blue-500 mb-4" />
                        <p className="text-gray-500 font-medium italic">Scanning global inventory...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            selectable={true}
                            onSelectionChange={setSelectedCards}
                        />

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="flex items-center gap-2 px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {loadingMore ? (
                                        <>
                                            <RefreshCw size={18} className="animate-spin" />
                                            Loading More...
                                        </>
                                    ) : (
                                        <>
                                            Show More Cards
                                            <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full ml-1 font-black">100+</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BuyCards;
