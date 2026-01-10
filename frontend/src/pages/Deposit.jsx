import { useState } from 'react';
import axios from 'axios';
import { Copy, CreditCard, CheckCircle, Smartphone } from 'lucide-react';
import Button from '../components/common/Button';

const Deposit = () => {
    const [amount, setAmount] = useState('');
    const [txId, setTxId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Hardcoded Admin Crypto Address
    const BTC_ADDRESS = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(BTC_ADDRESS);
        alert('Address copied!');
    };

    const handlePay = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            await axios.post('http://localhost:5000/api/deposits', {
                amount: Number(amount),
                transactionId: txId,
                method: 'BTC'
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Add Funds</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payment Methods */}
                <div className="space-y-6">
                    <div className="card p-6 border-l-4 border-blue-500">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <CreditCard className="text-blue-500" />
                            Bitcoin (BTC) Payment
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Send the exact amount to the address below. Minimum deposit $10.
                        </p>

                        <div className="bg-gray-100 dark:bg-dark-bg p-4 rounded-lg break-all font-mono text-sm mb-4 border border-gray-200 dark:border-dark-border relative group">
                            {BTC_ADDRESS}
                            <button
                                onClick={copyToClipboard}
                                className="absolute top-2 right-2 p-2 bg-white dark:bg-dark-card rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Copy size={16} />
                            </button>
                        </div>

                        <div className="text-xs text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded">
                            ⚠️ Ensure you are sending on the Bitcoin Network. Transfers are not reversible.
                        </div>
                    </div>
                </div>

                {/* Confirm Payment Form */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="text-green-500" />
                        Confirm Payment
                    </h3>

                    {message && (
                        <div className={`p-4 mb-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handlePay} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Amount Sent (USD)</label>
                            <input
                                type="number"
                                className="input-field w-full"
                                placeholder="50"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                min="5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Transaction ID (TXID)</label>
                            <input
                                type="text"
                                className="input-field w-full"
                                placeholder="Enter blockchain transaction hash..."
                                value={txId}
                                onChange={(e) => setTxId(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            loading={loading}
                        >
                            I Paid - Submit Request
                        </Button>
                        <p className="text-xs text-center text-gray-500 mt-2">
                            Admin will verify and credit balance shortly.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Deposit;
