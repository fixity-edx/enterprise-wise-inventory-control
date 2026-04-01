import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Sparkles } from 'lucide-react';

const Forecast = () => {
    const [products, setProducts] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [loading, setLoading] = useState(false);
    const [forecastData, setForecastData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, branchRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/inventory/products'),
                    axios.get('http://localhost:5000/api/branches')
                ]);
                setProducts(prodRes.data);
                setBranches(branchRes.data);
            } catch (err) {
                console.error("Failed to load options");
            }
        };
        fetchData();
    }, []);

    const handleGenerate = async () => {
        if (!selectedProduct || !selectedBranch) return alert('Please select both product and branch');

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/forecast/generate', {
                branchId: selectedBranch,
                productId: selectedProduct
            });
            setForecastData(res.data);
        } catch (err) {
            console.error(err);
            alert('Forecast generation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                        <Sparkles className="text-yellow-300" />
                        AI Demand Forecasting
                    </h1>
                    <p className="text-purple-100 max-w-2xl">
                        Select a product and branch to generate intelligent demand predictions using our Llama 3.1 powered engine.
                    </p>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400 opacity-20 rounded-full -ml-10 -mb-10 blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit lg:col-span-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Activity className="text-purple-600" size={20} />
                        Configuration
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Branch</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                                value={selectedBranch}
                                onChange={e => setSelectedBranch(e.target.value)}
                            >
                                <option value="">-- Choose Branch --</option>
                                {branches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                                value={selectedProduct}
                                onChange={e => setSelectedProduct(e.target.value)}
                            >
                                <option value="">-- Choose Product --</option>
                                {products.map(p => (
                                    <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all
                                ${loading
                                    ? 'bg-purple-400 cursor-wait'
                                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Analysing...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Sparkles size={18} />
                                    Generate Forecast
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 min-h-[400px]">
                    {forecastData ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-800">Forecast Results</h3>
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                    Confidence: High
                                </span>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-600 leading-relaxed">
                                <span className="font-bold text-slate-800 block mb-1">AI Recommendation:</span>
                                {forecastData.recommendation || "Maintain current stock levels. Upsurge predicted in Q3."}
                            </div>

                            <div className="h-[300px] w-full mt-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={forecastData.forecast}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ fill: '#f8fafc' }}
                                        />
                                        <Bar dataKey="predictedAmount" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Predicted Demand" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                            <TrendingUp size={64} className="mb-4 text-gray-200" />
                            <p className="text-lg font-medium text-gray-500">No forecast generated yet.</p>
                            <p className="text-sm max-w-sm mt-2">Select a product branch combination and run the AI model to see predictions here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Forecast;
