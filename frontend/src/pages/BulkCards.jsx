import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/common/Button';
import API_URL from '../config/api';

const BulkCards = () => {
    const navigate = useNavigate();
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(null);

    useEffect(() => {
        fetchBulkLots();
    }, []);

    const fetchBulkLots = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`${API_URL}/api/products?type=bulk&limit=100`, config);
            setLots(data.products || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bulk lots:', error);
            setLoading(false);
        }
    };

    const handlePurchase = async (lotId) => {
        if (!window.confirm('Confirm purchase of this bulk lot? This action is non-refundable.')) return;

        setPurchasing(lotId);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            await axios.post(`${API_URL}/api/orders/purchase/${lotId}`, {}, config);

            alert('Bulk lot purchased successfully!');
            navigate('/my-bulk-purchases');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to purchase bulk lot');
        } finally {
            setPurchasing(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Bulk Card Lots</h1>
                    <p className="text-gray-400">Save up to 40% with high-volume card packages</p>
                </div>
                <Button
                    variant="primary"
                    icon={ShoppingBag}
                    onClick={() => navigate('/my-bulk-purchases')}
                >
                    My Lots
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50 grayscale">
                    <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-400 font-medium tracking-widest uppercase">Fetching Bulk Inventory...</p>
                </div>
            ) : (!lots || lots.length === 0) ? (
                <div className="card p-20 text-center border-dashed border-gray-700 bg-transparent">
                    <Package size={64} className="mx-auto text-gray-700 mb-4" />
                    <h3 className="text-xl font-bold text-gray-500 mb-2">No Bulk Lots Available</h3>
                    <p className="text-gray-600">Check back later for new high-volume inventory.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.isArray(lots) && lots.map((lot) => (
                        <div key={lot._id} className="card p-0 overflow-hidden border-orange-500/10 hover:border-orange-500/30 group transition-all">
                            <div className="flex h-full">
                                <div className="hidden sm:flex w-32 bg-slate-800/80 items-center justify-center border-r border-slate-700">
                                    <Package size={40} className="text-orange-500 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1 p-6 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-[10px] font-bold rounded uppercase border border-orange-500/20 mb-2 inline-block">
                                                {lot.category || 'BULK LOT'}
                                            </span>
                                            <h3 className="text-xl font-bold text-white leading-tight">{lot.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-green-400 leading-none">${lot.price}</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase mt-1 italic line-through opacity-50">Value: ${(lot.price * 1.5).toFixed(0)}</div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-400 mb-6 line-clamp-2">
                                        {lot.description || 'Verified bulk card lot with high valid rate.'}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            INSTANT DELIVERY
                                        </div>
                                        <button
                                            disabled={purchasing === lot._id}
                                            onClick={() => handlePurchase(lot._id)}
                                            className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg text-xs font-black shadow-lg shadow-orange-900/20 flex items-center gap-2 transition-all transform hover:translate-x-1"
                                        >
                                            {purchasing === lot._id ? 'BUYING...' : (
                                                <>BUY LOT <ArrowRight size={14} /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BulkCards;
