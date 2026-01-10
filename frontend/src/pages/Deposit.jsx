import { useState } from 'react';
import { Copy, Check, Info, Wallet, Plus, Minus } from 'lucide-react';
import Button from '../components/common/Button';

// Coin Data with colors and mock addresses (to be replaced by Admin API later)
const COINS = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', color: 'text-orange-500', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
    { id: 'ltc', name: 'Litecoin', symbol: 'LTC', color: 'text-gray-400', address: 'ltc1qrg5j8900000000000000000000000000000000' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: 'text-purple-500', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
    { id: 'sol', name: 'Solana', symbol: 'SOL', color: 'text-green-500', address: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrx' },
    { id: 'trx', name: 'Tron', symbol: 'TRX', color: 'text-red-500', address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkkhxoyeS' },
    { id: 'xrp', name: 'Ripple', symbol: 'XRP', color: 'text-blue-500', address: 'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh' },
];

const Deposit = () => {
    const [selectedCoin, setSelectedCoin] = useState(COINS[0].id);
    const [showInvoice, setShowInvoice] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCreateDeposit = () => {
        setShowInvoice(true);
        // In real app, this would fetch a fresh unique address from backend
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const activeCoin = COINS.find(c => c.id === selectedCoin);

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Deposit</h1>
                <p className="text-gray-600 dark:text-gray-400">Add funds to your account balance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Deposit Form */}
                <div className="card p-6 h-fit">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Deposit</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Select coin and network to generate a deposit address
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Coin
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedCoin}
                                    onChange={(e) => {
                                        setSelectedCoin(e.target.value);
                                        setShowInvoice(false);
                                    }}
                                    className="input-field w-full appearance-none cursor-pointer"
                                >
                                    {COINS.map((coin) => (
                                        <option key={coin.id} value={coin.id}>
                                            {coin.name} ({coin.symbol})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Amount ({activeCoin?.symbol})
                            </label>
                            <div className="flex items-center">
                                <button className="px-4 py-3 bg-gray-100 dark:bg-dark-hover border border-r-0 border-gray-300 dark:border-dark-border rounded-l-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    <Minus size={16} />
                                </button>
                                <input
                                    type="number"
                                    className="w-full bg-white dark:bg-dark-bg border-y border-gray-300 dark:border-dark-border py-3 text-center text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="0.00"
                                    defaultValue="10.00"
                                />
                                <button className="px-4 py-3 bg-gray-100 dark:bg-dark-hover border border-l-0 border-gray-300 dark:border-dark-border rounded-r-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg flex items-start gap-3">
                            <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                            <div>
                                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                                    Minimum deposit: $10.00
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                                    Deposits less than the minimum will not be credited.
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={handleCreateDeposit}
                            className="w-full"
                        >
                            Create Deposit Invoice
                        </Button>
                    </div>
                </div>

                {/* Invoice / Address Display */}
                {showInvoice && activeCoin && (
                    <div className="card p-6 border-2 border-blue-500/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100 dark:border-dark-border">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-dark-bg rounded-xl flex items-center justify-center">
                                    <span className={`font-bold text-xl ${activeCoin.color}`}>
                                        {activeCoin.symbol[0]}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900 dark:text-white">Deposit {activeCoin.symbol}</h2>
                                    <p className="text-sm text-gray-500">Network: {activeCoin.name}</p>
                                </div>
                            </div>
                            <div className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Awaiting Payment
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Deposit Address
                                </label>
                                <div className="flex gap-2">
                                    <div className="input-field flex-1 font-mono text-sm break-all bg-gray-50 dark:bg-black/20 p-3">
                                        {activeCoin.address}
                                    </div>
                                    <button
                                        onClick={() => handleCopy(activeCoin.address)}
                                        className="h-full px-4 rounded-lg bg-gray-100 dark:bg-dark-hover text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-900 dark:hover:bg-gray-700 transition-colors"
                                        title="Copy Address"
                                    >
                                        {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                    </button>
                                </div>
                                <p className="text-xs text-red-500 mt-1">
                                    Warning: Send only {activeCoin.name} ({activeCoin.symbol}) to this address.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <p className="font-medium text-gray-900 dark:text-white">Waiting for transaction...</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Time Remaining</p>
                                    <p className="font-medium text-gray-900 dark:text-white">59:45</p>
                                </div>
                            </div>

                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg text-xs text-yellow-800 dark:text-yellow-200">
                                Payment will be credited automatically after <strong>admin confirmation</strong>.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Deposit;
