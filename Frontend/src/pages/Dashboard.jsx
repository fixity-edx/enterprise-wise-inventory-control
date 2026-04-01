import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:scale-105">
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-90`}>
            <Icon size={24} className="text-white" />
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStock: 0,
        totalValue: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/forecast/analytics');
                setStats({
                    totalProducts: res.data.totalProducts || 0,
                    lowStock: res.data.lowStockCount || 0,
                    totalValue: res.data.totalInventoryValue || 0
                });
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Welcome back to your enterprise inventory command center.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="bg-blue-600"
                />
                <StatCard
                    title="Low Stock Warning"
                    value={stats.lowStock}
                    icon={AlertCircle}
                    color="bg-amber-500"
                />
                <StatCard
                    title="Est. Inventory Value"
                    value={`$${stats.totalValue.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-emerald-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="text-blue-300" size={28} />
                            <h2 className="text-2xl font-bold">AI Demand Forecasting</h2>
                        </div>
                        <p className="text-blue-100 max-w-md mb-6 leading-relaxed">
                            Our Grok AI integration analyzes historical sales data to predict future demand trends, helping you avoid stockouts and overstocking.
                        </p>
                        <Link to="/forecast" className="inline-flex items-center bg-white text-blue-700 px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-50 transition-colors">
                            Run Forecast Models
                        </Link>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 opacity-20 rounded-full -ml-10 -mb-10 blur-3xl"></div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link to="/inventory" className="block w-full p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all group">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700 group-hover:text-blue-700">Add New Product</span>
                                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                        <Link to="/branches" className="block w-full p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all group">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700 group-hover:text-blue-700">Manage Branches</span>
                                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
