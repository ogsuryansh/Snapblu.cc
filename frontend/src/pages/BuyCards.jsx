import { useState } from 'react';
import { Filter, Columns3, ShoppingCart } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';

const BuyCards = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBase, setSelectedBase] = useState('all');
    const [selectedCards, setSelectedCards] = useState([]);
    const [showColumnMenu, setShowColumnMenu] = useState(false);

    // Sample data
    const cardsData = [
        {
            cardNumber: '7196',
            bin: '438854',
            brand: 'VISA',
            type: 'CREDIT',
            level: 'CLASSIC',
            issuer: 'CHASE BANK USA, N.A.',
            country: 'UNITED STATES',
            city: 'Holly Springs',
            state: 'NC',
        },
        {
            cardNumber: '8982',
            bin: '455958',
            brand: 'VISA',
            type: 'CREDIT',
            level: 'CLASSIC',
            issuer: 'CHASE BANK USA, N.A.',
            country: 'UNITED STATES',
            city: 'Holliston',
            state: 'MA',
        },
        {
            cardNumber: '1887',
            bin: '379282',
            brand: 'AMERICAN EXPRESS',
            type: 'CREDIT',
            level: '-',
            issuer: 'AMERICAN EXPRESS US',
            country: 'UNITED STATES',
            city: 'Toledo',
            state: 'OH',
        },
        {
            cardNumber: '9222',
            bin: '412138',
            brand: 'VISA',
            type: 'CREDIT',
            level: 'CLASSIC',
            issuer: 'CHASE BANK USA, N.A.',
            country: 'UNITED STATES',
            city: 'Sussex',
            state: 'WI',
        },
        {
            cardNumber: '1636',
            bin: '421156',
            brand: 'VISA',
            type: 'CREDIT',
            level: 'CLASSIC',
            issuer: 'CHASE BANK USA, N.A.',
            country: 'UNITED STATES',
            city: 'Richland',
            state: '-',
        },
        {
            cardNumber: '3788',
            bin: '544768',
            brand: 'MASTERCARD',
            type: 'DEBIT',
            level: 'PREPAID',
            issuer: 'METABANK',
            country: 'UNITED STATES',
            city: 'Charlotte',
            state: 'NC',
        },
        {
            cardNumber: '3848',
            bin: '531445',
            brand: 'MASTERCARD',
            type: 'DEBIT',
            level: 'PREPAID BUSINESS',
            issuer: 'CHOICE BANK, LTD.',
            country: 'BELIZE',
            city: 'Ellenburg',
            state: '',
        },
    ];

    const columns = [
        {
            key: 'cardNumber',
            label: 'Card Number',
            sortable: true,
            render: (row) => (
                <span className="text-blue-400 font-mono">{row.cardNumber}</span>
            ),
        },
        { key: 'bin', label: 'BIN', sortable: true },
        { key: 'brand', label: 'Brand', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'level', label: 'Level', sortable: true },
        { key: 'issuer', label: 'Issuer', sortable: true },
        { key: 'country', label: 'Country', sortable: true },
        { key: 'city', label: 'City', sortable: true },
        { key: 'state', label: 'State', sortable: true },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Buy Cards</h1>
                <p className="text-gray-600 dark:text-gray-400">Purchase credit cards from available bases</p>
            </div>

            {/* Filters and Search */}
            <div className="card p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <SearchBar
                        placeholder="Search cards, base name, BIN, brand..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                        className="flex-1"
                    />

                    <div className="flex gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                Filter by Base:
                            </label>
                            <select
                                value={selectedBase}
                                onChange={(e) => setSelectedBase(e.target.value)}
                                className="input-field min-w-[150px]"
                            >
                                <option value="all">All Bases</option>
                                <option value="base1">Base 1</option>
                                <option value="base2">Base 2</option>
                            </select>
                        </div>

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
                <DataTable
                    columns={columns}
                    data={cardsData}
                    selectable
                    onSelectionChange={setSelectedCards}
                />
            </div>
        </div>
    );
};

export default BuyCards;
