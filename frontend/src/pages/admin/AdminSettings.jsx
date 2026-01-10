import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Wallet } from 'lucide-react';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        btcAddress: '',
        ltcAddress: '',
        usdtAddress: '',
        ethAddress: '',
        solAddress: '',
        trxAddress: '',
        xrpAddress: '',
        xmrAddress: '',
        dogeAddress: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/settings');
                setSettings({
                    btcAddress: data.btcAddress || '',
                    ltcAddress: data.ltcAddress || '',
                    usdtAddress: data.usdtAddress || '',
                    ethAddress: data.ethAddress || '',
                    solAddress: data.solAddress || '',
                    trxAddress: data.trxAddress || '',
                    xrpAddress: data.xrpAddress || '',
                    xmrAddress: data.xmrAddress || '',
                    dogeAddress: data.dogeAddress || ''
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };

            await axios.put('http://localhost:5000/api/settings', settings, config);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings' });
        }
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-8 max-w-2xl">
            <h1 className="text-2xl font-bold text-white mb-8">Payment Settings</h1>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                    <div className="bg-blue-600/20 p-2 rounded-lg text-blue-500">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Wallet Addresses</h3>
                        <p className="text-slate-400 text-sm">Set the crypto addresses displayed to users</p>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 mb-6 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: 'Bitcoin (BTC)', name: 'btcAddress', ph: 'bc1q...' },
                        { label: 'Litecoin (LTC)', name: 'ltcAddress', ph: 'LTC...' },
                        { label: 'USDT (TRC20)', name: 'usdtAddress', ph: 'T...' },
                        { label: 'Ethereum (ETH)', name: 'ethAddress', ph: '0x...' },
                        { label: 'Solana (SOL)', name: 'solAddress', ph: 'Sol...' },
                        { label: 'Tron (TRX)', name: 'trxAddress', ph: 'T...' },
                        { label: 'Ripple (XRP)', name: 'xrpAddress', ph: 'r...' },
                        { label: 'Monero (XMR)', name: 'xmrAddress', ph: '4...' },
                        { label: 'Dogecoin (DOGE)', name: 'dogeAddress', ph: 'D...' },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-slate-300 mb-1">{field.label}</label>
                            <input
                                type="text"
                                name={field.name}
                                className="input-field-admin font-mono text-xs"
                                placeholder={field.ph}
                                value={settings[field.name]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all w-full justify-center"
                        >
                            <Save size={18} /> Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
