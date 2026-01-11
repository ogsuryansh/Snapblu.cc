import { useState, useEffect } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/common/SearchBar';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/common/Button';
import API_URL from '../config/api';

const BuyLogs = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`${API_URL}/api/products`, config);
            // Filter for only unsold logs
            setProducts(data.filter(p => p.type === 'log'));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching logs:', error);
            setLoading(false);
        }
    };

    const handlePurchase = async (productId) => {
        if (!window.confirm('Are you sure you want to purchase this log?')) return;

        setPurchasing(productId);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            const { data } = await axios.post(`${API_URL}/api/orders/purchase/${productId}`, {}, config);

            alert(data.message || 'Purchase successful!');
            navigate('/my-log-orders');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to purchase log');
        } finally {
            setPurchasing(false);
        }
    };

    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Logs & Accounts</h1>
                    <p className="text-gray-400">Instant access to premium accounts and logs</p>
                </div>
                <Button
                    variant="primary"
                    icon={ShoppingBag}
                    onClick={() => navigate('/my-log-orders')}
                >
                    My Log Orders
                </Button>
            </div>

            {/* Filters */}
            <div className="card p-4 mb-6 shadow-xl border-blue-500/10">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Search by name or category..."
                            value={searchQuery}
                            onChange={setSearchQuery}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-400 whitespace-nowrap">
                            Category:
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="input-field min-w-[200px]"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                    <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-400 font-medium tracking-widest">LOADING INVENTORY...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="card p-20 text-center border-dashed border-gray-700 bg-transparent">
                    <ShoppingBag size={64} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-400 text-lg">No logs found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onPurchase={handlePurchase}
                            purchasing={purchasing === product._id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BuyLogs;
