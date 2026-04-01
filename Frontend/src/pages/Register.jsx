import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('inventory_manager');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role);
            navigate('/');
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
            <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl w-full max-w-md p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                <div className="flex items-center justify-center mb-6">
                    <Package className="text-blue-600" size={48} />
                </div>

                <h2 className="text-3xl font-bold mb-2 text-slate-800 text-center">Create Account</h2>
                <p className="text-slate-500 mb-8 text-center">Join the inventory management platform</p>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <select
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="admin">🛡️ Admin - Full System Access</option>
                            <option value="inventory_manager">📦 Inventory Manager - Manage Products & Forecasts</option>
                            <option value="branch_manager">🏢 Branch Manager - Manage Locations</option>
                            <option value="procurement_officer">📊 Procurement Officer - View & Forecast</option>
                            <option value="analyst">👁️ Analyst - View-Only + Forecasts</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            {role === 'admin' && '✅ Full access to all features including user management'}
                            {role === 'inventory_manager' && '✅ Manage products and generate forecasts'}
                            {role === 'branch_manager' && '✅ Manage branches, view-only for inventory'}
                            {role === 'procurement_officer' && '✅ View inventory and generate forecasts'}
                            {role === 'analyst' && '✅ View-only access with forecasting capabilities'}
                        </p>
                    </div>

                    <button type="submit" className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-300 transition-all duration-300 transform hover:-translate-y-0.5">
                        Create Account
                    </button>

                    <p className="text-center text-sm text-slate-500 mt-4">
                        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
