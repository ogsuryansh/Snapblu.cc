import { Package, ShoppingCart, Heart } from 'lucide-react';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import ProductCard from '../components/common/ProductCard';
import { useState } from 'react';

const ComponentShowcase = () => {
    const [search, setSearch] = useState('');

    const sampleProduct = {
        id: 1,
        name: 'Sample Product Card',
        category: 'DEMO',
        description: 'This is a sample product card to showcase the design.',
        price: '29.99',
        stock: 42,
    };

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Component Showcase</h1>
                <p className="text-gray-400">Preview of all available UI components</p>
            </div>

            {/* Buttons */}
            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Buttons</h2>
                <div className="card p-6">
                    <div className="flex flex-wrap gap-4">
                        <Button variant="primary">Primary Button</Button>
                        <Button variant="secondary">Secondary Button</Button>
                        <Button variant="outline">Outline Button</Button>
                        <Button variant="ghost">Ghost Button</Button>
                        <Button variant="primary" icon={ShoppingCart}>With Icon</Button>
                        <Button variant="primary" size="sm">Small</Button>
                        <Button variant="primary" size="lg">Large</Button>
                        <Button variant="primary" disabled>Disabled</Button>
                    </div>
                </div>
            </section>

            {/* Search Bar */}
            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Search Bar</h2>
                <div className="card p-6">
                    <SearchBar
                        placeholder="Search anything..."
                        value={search}
                        onChange={setSearch}
                    />
                </div>
            </section>

            {/* Product Card */}
            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Product Card</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProductCard product={sampleProduct} />
                    <ProductCard product={{ ...sampleProduct, stock: 0, name: 'Out of Stock Item' }} />
                    <ProductCard product={{ ...sampleProduct, stock: 156, price: '5.99' }} />
                </div>
            </section>

            {/* Empty State */}
            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Empty State</h2>
                <div className="card">
                    <EmptyState
                        icon={Package}
                        title="No items found"
                        description="There are no items available at this time. Check back later!"
                        action={<Button variant="primary" icon={Heart}>Add Items</Button>}
                    />
                </div>
            </section>

            {/* Stat Cards */}
            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Stat Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card border-l-4 border-l-blue-500 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <ShoppingCart size={20} className="text-blue-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">$12,345</p>
                            <p className="text-xs text-gray-500">+12% from last month</p>
                        </div>
                    </div>

                    <div className="card border-l-4 border-l-purple-500 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <Package size={20} className="text-purple-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">2,456</p>
                            <p className="text-xs text-gray-500">+5% from last week</p>
                        </div>
                    </div>

                    <div className="card border-l-4 border-l-green-500 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-400">Success Rate</h3>
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <Heart size={20} className="text-green-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">98.5%</p>
                            <p className="text-xs text-gray-500">Above target</p>
                        </div>
                    </div>

                    <div className="card border-l-4 border-l-orange-500 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-400">Pending Orders</h3>
                            <div className="p-2 rounded-lg bg-orange-500/10">
                                <ShoppingCart size={20} className="text-orange-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">42</p>
                            <p className="text-xs text-gray-500">Needs attention</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Elements */}
            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Form Elements</h2>
                <div className="card p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Text Input
                        </label>
                        <input
                            type="text"
                            placeholder="Enter text..."
                            className="input-field w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Select Dropdown
                        </label>
                        <select className="input-field w-full">
                            <option>Option 1</option>
                            <option>Option 2</option>
                            <option>Option 3</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                className="rounded bg-dark-bg border-dark-border text-blue-600 focus:ring-blue-600"
                            />
                            Checkbox Label
                        </label>
                    </div>
                </div>
            </section>

            {/* Badges */}
            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Badges</h2>
                <div className="card p-6">
                    <div className="flex flex-wrap gap-3">
                        <span className="badge bg-blue-500/10 text-blue-500">Info</span>
                        <span className="badge bg-green-500/10 text-green-500">Success</span>
                        <span className="badge bg-yellow-500/10 text-yellow-500">Warning</span>
                        <span className="badge bg-red-500/10 text-red-500">Error</span>
                        <span className="badge bg-purple-500/10 text-purple-500">Premium</span>
                        <span className="badge bg-gray-600 text-white">Default</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ComponentShowcase;
