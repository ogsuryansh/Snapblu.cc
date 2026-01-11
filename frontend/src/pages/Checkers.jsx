import { useState } from 'react';
import { Search, ShieldCheck, CreditCard, RefreshCw, CheckCircle, XCircle, Loader2, Info } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config/api';
import Button from '../components/common/Button';

const Checkers = () => {
    const [activeTab, setActiveTab] = useState('bin');
    const [loading, setLoading] = useState(false);

    // BIN Checker State
    const [binValue, setBinValue] = useState('');
    const [binResult, setBinResult] = useState(null);

    // Card Checker State
    const [cardData, setCardData] = useState('');
    const [cardResult, setCardResult] = useState(null);

    const handleBinCheck = async (e) => {
        e.preventDefault();
        if (binValue.length < 6) return alert('Enter at least 6 digits');

        setLoading(true);
        setBinResult(null);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post(`${API_URL}/api/products/check-bin`, { bin: binValue }, config);
            setBinResult(data);
        } catch (error) {
            alert(error.response?.data?.message || 'Check failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCardCheck = async (e) => {
        e.preventDefault();
        if (!cardData.trim()) return alert('Enter card data');

        setLoading(true);
        setCardResult(null);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post(`${API_URL}/api/products/check-card`, { data: cardData }, config);
            setCardResult(data);
        } catch (error) {
            alert(error.response?.data?.message || 'Check failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Checkers & Tools</h1>
                <p className="text-gray-400">Verify BIN information and card validity in real-time</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700 w-fit mb-8">
                <button
                    onClick={() => setActiveTab('bin')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'bin' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <Search size={16} /> BIN LOOKUP
                </button>
                <button
                    onClick={() => setActiveTab('card')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'card' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <ShieldCheck size={16} /> CARD CHECKER
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    {activeTab === 'bin' ? (
                        <div className="card border-blue-500/10">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Search className="text-blue-500" size={20} /> BIN Information Lookup
                            </h2>
                            <p className="text-sm text-slate-400 mb-6">Enter the first 6 or 8 digits of a card to get full issuer details, country and brand info.</p>

                            <form onSubmit={handleBinCheck} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Card BIN (First 6-8 digits)</label>
                                    <input
                                        type="number"
                                        placeholder="414720"
                                        className="input-field py-4 text-xl tracking-[0.5em] font-mono"
                                        value={binValue}
                                        onChange={(e) => setBinValue(e.target.value)}
                                        maxLength={8}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full py-4 text-base"
                                    disabled={loading || binValue.length < 6}
                                >
                                    {loading ? <><RefreshCw size={20} className="animate-spin" /> FETCHING...</> : 'LOOKUP BIN'}
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="card border-blue-500/10">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <ShieldCheck className="text-blue-500" size={20} /> CC Status Checker
                            </h2>
                            <p className="text-sm text-slate-400 mb-6 font-medium">Format: <span className="text-blue-400">NUMBER|MM|YY|CVV</span></p>

                            <form onSubmit={handleCardCheck} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Card Data</label>
                                    <textarea
                                        placeholder="4147200011112222|12|28|123"
                                        className="input-field min-h-[120px] font-mono py-3"
                                        value={cardData}
                                        onChange={(e) => setCardData(e.target.value)}
                                    />
                                </div>
                                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg flex gap-3">
                                    <Info size={18} className="text-blue-500 shrink-0" />
                                    <p className="text-[11px] text-slate-400 leading-relaxed">Our checker performs a <span className="text-white font-bold">$0.00 / $1.00 Auth</span> to verify validity. Cards checked here are NOT automatically added to the store.</p>
                                </div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full py-4 text-base"
                                    disabled={loading || !cardData}
                                >
                                    {loading ? <><RefreshCw size={20} className="animate-spin" /> CHECKING CC...</> : 'CHECK VALIDITY'}
                                </Button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Result Section */}
                <div className="space-y-6">
                    {activeTab === 'bin' && (
                        <div className="card min-h-[400px] flex flex-col border-blue-500/5">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-700 pb-2">Results</h3>

                            {!binResult && !loading && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 grayscale">
                                    <Search size={64} className="mb-4" />
                                    <p className="text-sm font-bold">READY TO SCAN</p>
                                </div>
                            )}

                            {loading && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest animate-pulse">Querying Bank Servers...</p>
                                </div>
                            )}

                            {binResult && (
                                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                            <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Brand</span>
                                            <span className="text-lg font-black text-white">{binResult.brand}</span>
                                        </div>
                                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                            <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Type</span>
                                            <span className="text-lg font-black text-blue-400">{binResult.type}</span>
                                        </div>
                                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                            <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Level</span>
                                            <span className="text-lg font-black text-purple-400">{binResult.level}</span>
                                        </div>
                                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                            <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Country</span>
                                            <span className="text-lg font-black text-white flex items-center gap-2">
                                                {binResult.flag} {binResult.country}
                                            </span>
                                        </div>
                                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 col-span-2">
                                            <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Issuer / Bank</span>
                                            <span className="text-xl font-black text-green-400">{binResult.bank}</span>
                                        </div>
                                    </div>
                                    {!binResult.success && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold flex items-center gap-2">
                                            <XCircle size={18} /> {binResult.message}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'card' && (
                        <div className="card min-h-[400px] flex flex-col border-blue-500/5">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-700 pb-2">Status Output</h3>

                            {!cardResult && !loading && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 grayscale">
                                    <ShieldCheck size={64} className="mb-4" />
                                    <p className="text-sm font-bold">AWAITING AUTHORIZATION</p>
                                </div>
                            )}

                            {loading && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <div className="relative mb-6">
                                        <div className="w-20 h-20 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                                        <CreditCard size={32} className="absolute inset-0 m-auto text-blue-500 animate-pulse" />
                                    </div>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest animate-pulse">Simulating Transaction...</p>
                                </div>
                            )}

                            {cardResult && (
                                <div className="flex-1 flex flex-col animate-in zoom-in duration-300">
                                    <div className={`p-8 rounded-2xl flex flex-col items-center justify-center text-center mb-6 border-2 ${cardResult.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                        {cardResult.success ? (
                                            <CheckCircle size={64} className="text-green-500 mb-4" />
                                        ) : (
                                            <XCircle size={64} className="text-red-500 mb-4" />
                                        )}
                                        <h4 className={`text-4xl font-black mb-1 ${cardResult.success ? 'text-green-500' : 'text-red-500'}`}>
                                            {cardResult.status}
                                        </h4>
                                        <p className="text-sm font-bold text-slate-400 capitalize">{cardResult.message}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 text-sm">
                                            <span className="text-slate-500 font-bold">RESPONSE CODE</span>
                                            <span className={`font-mono font-bold ${cardResult.success ? 'text-green-400' : 'text-red-400'}`}>{cardResult.code}</span>
                                        </div>
                                        <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 text-sm">
                                            <span className="text-slate-500 font-bold">TYPE</span>
                                            <span className="text-white font-bold">CREDIT / DEBIT</span>
                                        </div>
                                        <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 text-sm">
                                            <span className="text-slate-500 font-bold">GATEWAY</span>
                                            <span className="text-blue-400 font-bold uppercase tracking-widest">Stripe / Braintree v3</span>
                                        </div>
                                    </div>

                                    <p className="mt-8 text-[10px] text-slate-500 text-center uppercase tracking-[0.2em] font-black">Powered by Snapblu Security</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkers;
