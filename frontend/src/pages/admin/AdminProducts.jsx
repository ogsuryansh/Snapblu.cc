import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, CreditCard, DollarSign, User, MapPin } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        cardNumber: '',
        exp: '',
        cvv: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        state: '',
        country: 'US',
        bin: '',
        brand: 'VISA',
        type: 'CREDIT',
        level: 'CLASSIC',
        issuer: '',
        price: 5
    });

    const fetchProducts = async () => {
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/products', config);
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Auto-fill BIN and Brand from Card Number
    useEffect(() => {
        if (formData.cardNumber && formData.cardNumber.length >= 6) {
            const bin = formData.cardNumber.substring(0, 6);
            let brand = 'VISA';
            if (bin.startsWith('5')) brand = 'MASTERCARD';
            if (bin.startsWith('3')) brand = 'AMEX';
            if (bin.startsWith('6')) brand = 'DISCOVER';

            setFormData(prev => ({
                ...prev,
                bin: bin,
                brand: brand
            }));
        }
    }, [formData.cardNumber]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
            await axios.delete(`http://localhost:5000/api/products/${id}`, config);
            fetchProducts();
        } catch (error) {
            alert('Error deleting product');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };

            // Send all data
            await axios.post('http://localhost:5000/api/products', {
                ...formData,
                type: 'card'
            }, config);

            setIsModalOpen(false);
            fetchProducts();
            // Reset Form
            setFormData({
                cardNumber: '', exp: '', cvv: '', name: '', email: '', phone: '',
                address: '', city: '', zip: '', state: '', country: 'US',
                bin: '', brand: 'VISA', type: 'CREDIT', level: 'CLASSIC', issuer: '', price: 5
            });
        } catch (error) {
            alert('Error adding product: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-white">Product Inventory</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg shadow-blue-900/20"
                >
                    <Plus size={18} /> Add New Card
                </button>
            </div>

            {loading ? (
                <div className="text-slate-500 text-center animate-pulse">Loading inventory...</div>
            ) : (
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Card Info</th>
                                    <th className="px-6 py-4">Details</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {products.map((p) => (
                                    <tr key={p._id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-700 p-2 rounded">
                                                    <CreditCard size={16} className="text-blue-400" />
                                                </div>
                                                <div>
                                                    <div className="font-mono text-white font-medium">{p.cardNumber}</div>
                                                    <div className="text-xs text-slate-500">{p.brand} • {p.type}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs">
                                                <div className="text-slate-300"><span className="text-slate-500">Exp:</span> {p.exp || '--'}</div>
                                                <div className="text-slate-300"><span className="text-slate-500">CVV:</span> {p.cvv || '---'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs">
                                                <div>{p.city !== 'unknown' ? p.city : '-'}, {p.state !== 'unknown' ? p.state : '-'}</div>
                                                <div className="text-slate-500">{p.zip !== 'unknown' ? p.zip : ''} {p.country}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-bold border border-green-500/20">
                                                ${p.price}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                className="text-slate-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded transition-colors"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <CreditCard size={48} className="text-slate-700" />
                                                <p>Inventory is empty.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Card Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-xl max-w-2xl w-full p-6 border border-slate-700 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Plus className="text-blue-500" /> Add New Card
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Card Details */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <CreditCard size={14} /> Financial Data
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="text-xs text-slate-400 mb-1 block">Card Number</label>
                                        <input name="cardNumber" placeholder="4147 2024 1092 1029" className="input-field-admin" value={formData.cardNumber} onChange={handleChange} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Exp (MM/YYYY)</label>
                                            <input name="exp" placeholder="12/28" className="input-field-admin" value={formData.exp} onChange={handleChange} required />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">CVV</label>
                                            <input name="cvv" placeholder="123" className="input-field-admin" value={formData.cvv} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">BIN</label>
                                            <input name="bin" placeholder="414720" className="input-field-admin" value={formData.bin} onChange={handleChange} required />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Price ($)</label>
                                            <div className="relative">
                                                <DollarSign size={14} className="absolute left-3 top-3.5 text-slate-500" />
                                                <input name="price" type="number" placeholder="5" className="input-field-admin pl-8" value={formData.price} onChange={handleChange} required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Brand</label>
                                            <select name="brand" className="input-field-admin" value={formData.brand} onChange={handleChange}>
                                                <option value="VISA">VISA</option>
                                                <option value="MASTERCARD">MASTERCARD</option>
                                                <option value="AMEX">AMEX</option>
                                                <option value="DISCOVER">DISCOVER</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Issuer/Bank</label>
                                            <input name="issuer" placeholder="Bank of America" className="input-field-admin" value={formData.issuer} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Details */}
                            <div className="space-y-4 pt-4 border-t border-slate-700">
                                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <User size={14} /> Personal Info (Optional)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input name="name" placeholder="Full Name" className="input-field-admin" value={formData.name} onChange={handleChange} />
                                    <input name="email" placeholder="Email Address" className="input-field-admin" value={formData.email} onChange={handleChange} />
                                    <input name="phone" placeholder="Phone Number" className="input-field-admin" value={formData.phone} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="space-y-4 pt-4 border-t border-slate-700">
                                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <MapPin size={14} /> Location (Optional)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input name="address" placeholder="Address Line" className="input-field-admin md:col-span-2" value={formData.address} onChange={handleChange} />
                                    <input name="city" placeholder="City" className="input-field-admin" value={formData.city} onChange={handleChange} />
                                    <input name="state" placeholder="State/Region" className="input-field-admin" value={formData.state} onChange={handleChange} />
                                    <input name="zip" placeholder="ZIP Code" className="input-field-admin" value={formData.zip} onChange={handleChange} />
                                    <input name="country" placeholder="Country" className="input-field-admin" value={formData.country} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-700">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white px-6 py-2 transition-colors">Cancel</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-900/40 transition-all transform hover:scale-105">Save Card</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
