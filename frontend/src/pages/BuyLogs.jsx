import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/common/Button';

const BuyLogs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Sample products data
    const products = [
        {
            id: 1,
            name: 'CHICK FIL A (FREE SANDWICH)',
            category: 'FOOD',
            description: 'Chick-Fil-A (Free Sandwich) ENJOY!! SCAN QR AT CHECKOUT THIS BATCH EXPIRES...',
            price: '3.00',
            stock: 45,
            image: null,
        },
        {
            id: 2,
            name: 'PANDA EXPRESS + CC',
            category: 'PANDAEXPRESS',
            description: 'NO REPLACEMENT FOR 2FA, BUY AT OWN RISK PRODUCT Use good ip to login, and...',
            price: '2.50',
            stock: 155,
            image: null,
        },
        {
            id: 3,
            name: 'IHG ($325 GIFT CARD)',
            category: 'IHG',
            description: 'No description',
            price: '65.00',
            stock: 0,
            image: null,
        },
        {
            id: 4,
            name: 'IHG ($15 GIFT CARD)',
            category: 'IHG',
            description: 'No description',
            price: '4.50',
            stock: 12,
            image: null,
        },
        {
            id: 5,
            name: 'IHG ($50 GIFT CARD )',
            category: 'IHG',
            description: 'HIT FOR GIFT CARD / HOTEL',
            price: '12.00',
            stock: 8,
            image: null,
        },
        {
            id: 6,
            name: 'HIBBET + CC (DESIGNER SHOES)',
            category: 'SHOES',
            description: 'Hibbett Method: Sign into your account on Hibbett and...',
            price: '8.00',
            stock: 3,
            image: null,
        },
    ];

    const categories = ['all', 'FOOD', 'PANDAEXPRESS', 'IHG', 'SHOES'];

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Logs</h1>
                    <p className="text-gray-400">Browse and purchase log products</p>
                </div>
                <Button variant="primary" icon={ShoppingBag}>
                    My Purchases
                </Button>
            </div>

            {/* Filters */}
            <div className="card p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <SearchBar
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                        className="flex-1"
                    />

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-400 whitespace-nowrap">
                            Filter by Category:
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="input-field min-w-[180px]"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="card p-12 text-center">
                    <p className="text-gray-400">No products found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default BuyLogs;
