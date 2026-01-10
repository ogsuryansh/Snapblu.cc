import { useState, useEffect } from 'react';
import axios from 'axios';
import { Copy, CreditCard, CheckCircle, Wallet, ChevronDown, Check } from 'lucide-react';
import Button from '../components/common/Button';

const Deposit = () => {
    const [amount, setAmount] = useState('');
    const [txId, setTxId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [addresses, setAddresses] = useState({});
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/settings');
                setAddresses(data);
                setSettingsLoaded(true);
            } catch (error) {
                console.error('Error fetching settings');
            }
        };
        fetchSettings();
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Address copied!');
    };

    // Available Wallets Mapping
    const allWallets = [
        { id: 'BTC', name: 'Bitcoin (BTC)', addr: addresses.btcAddress, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { id: 'LTC', name: 'Litecoin (LTC)', addr: addresses.ltcAddress, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'USDT', name: 'USDT (TRC20)', addr: addresses.usdtAddress, color: 'text-green-500', bg: 'bg-green-500/10' },
        { id: 'ETH', name: 'Ethereum (ETH)', addr: addresses.ethAddress, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { id: 'SOL', name: 'Solana (SOL)', addr: addresses.solAddress, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { id: 'TRX', name: 'Tron (TRX)', addr: addresses.trxAddress, color: 'text-red-500', bg: 'bg-red-500/10' },
        { id: 'XRP', name: 'Ripple (XRP)', addr: addresses.xrpAddress, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { id: 'XMR', name: 'Monero (XMR)', addr: addresses.xmrAddress, color: 'text-orange-700', bg: 'bg-orange-700/10' },
        { id: 'DOGE', name: 'Dogecoin (DOGE)', addr: addresses.dogeAddress, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    ];

    // Filter only those that have an address set by Admin
    const activeWallets = allWallets.filter(w => w.addr && w.addr.length > 5);

    // Set default selected coin once loaded
    useEffect(() => {
        if (activeWallets.length > 0 && !selectedCoin) {
            setSelectedCoin(activeWallets[0].id);
        }
    }, [addresses, selectedCoin]);

    const activeWallet = activeWallets.find(w => w.id === selectedCoin);

    const handlePay = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (Number(amount) < 10) {
            setMessage({ type: 'error', text: 'Minimum deposit amount is $10' });
            return;
        }

        setLoading(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            await axios.post('http://localhost:5000/api/deposits', {
                amount: Number(amount),
                transactionId: txId,
                method: selectedCoin // Send specific coin (e.g., BTC, ETH)
            }, config);

            setMessage({ type: 'success', text: 'Payment submitted! Please wait for admin approval.' });
            setAmount('');
            setTxId('');
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Deposit failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add Funds</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Select a cryptocurrency to view the deposit address.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left: Select & Address */}
                <div className="space-y-6">
                    <div className="card p-6">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Select Payment Method
                        </label>

                        {!settingsLoaded ? (
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : activeWallets.length === 0 ? (
                            <div className="text-red-500 text-sm">No payment methods available.</div>
                        ) : (
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 dark:text-white transition-shadow shadow-sm cursor-pointer"
                                    value={selectedCoin}
                                    onChange={(e) => setSelectedCoin(e.target.value)}
                                >
                                    {activeWallets.map(w => (
                                        <option key={w.id} value={w.id}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        )}

                        {/* Display Active Wallet Address */}
                        {activeWallet && (
                            <div className="mt-6 animate-fade-in-up">
                                <div className={`flex items-center gap-3 p-4 rounded-t-lg border border-b-0 border-gray-200 dark:border-dark-border ${activeWallet.bg}`}>
                                    <div className={`p-2 rounded-full bg-white dark:bg-dark-card shadow-sm ${activeWallet.color}`}>
                                        <Wallet size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Deposit Address</p>
                                        <p className={`font-bold ${activeWallet.color}`}>{activeWallet.name}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-dark-border rounded-b-lg p-4 break-all font-mono text-sm relative group">
                                    <p className="text-gray-800 dark:text-gray-200 pr-8">
                                        {activeWallet.addr}
                                    </p>
                                    <button
                                        onClick={() => copyToClipboard(activeWallet.addr)}
                                        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-500 bg-white dark:bg-dark-card rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-all transform hover:scale-105"
                                        title="Copy Address"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>

                                <div className="mt-4 flex items-start gap-2 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded">
                                    <div className="font-bold">⚠️</div>
                                    <p>Send only <span className="font-bold">{activeWallet.id}</span> to this address. Sending any other coin may result in permanent loss.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Confirmation Form */}
                <div className="card p-6 h-fit">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-dark-border pb-4">
                        <CheckCircle className="text-green-500" />
                        Confirm Transaction
                    </h3>

                    {message && (
                        <div className={`p-4 mb-4 rounded-xl flex items-start gap-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.type === 'success' ? <CheckCircle size={18} className="mt-0.5 shrink-0" /> : <div className="mt-0.5 shrink-0 font-bold">!</div>}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handlePay} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Amount (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        className="input-field w-full pl-7"
                                        placeholder="Min 10"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        min="10"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Method</label>
                                <input
                                    type="text"
                                    className="input-field w-full bg-gray-100 dark:bg-dark-hover text-gray-500 cursor-not-allowed"
                                    value={selectedCoin || 'None'}
                                    disabled
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Transaction Hash (TXID)</label>
                            <input
                                type="text"
                                className="input-field w-full font-mono text-sm"
                                placeholder="Paste your transaction ID here..."
                                value={txId}
                                onChange={(e) => setTxId(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-900/20 transform hover:-translate-y-0.5 transition-all"
                            loading={loading}
                        >
                            I Have Paid
                        </Button>
                        <p className="text-xs text-center text-gray-400 mt-2">
                            Min Deposit: <span className="font-bold text-gray-500">$10</span>. Admin approval required.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Deposit;
