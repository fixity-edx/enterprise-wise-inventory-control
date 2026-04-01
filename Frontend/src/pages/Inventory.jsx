import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Package, Eye, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Inventory = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newProduct, setNewProduct] = useState({ name: '', sku: '', price: '', minStockLevel: '', category: '' });

    // Role-based permissions
    const canManage = ['admin', 'inventory_manager'].includes(user?.role);
    const isViewOnly = ['analyst', 'procurement_officer', 'branch_manager'].includes(user?.role);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/inventory/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!canManage) {
            alert('You do not have permission to add products');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/inventory/products', newProduct);
            setShowAdd(false);
            setNewProduct({ name: '', sku: '', price: '', minStockLevel: '', category: '' });
            fetchProducts();
        } catch (err) {
            alert('Failed to add product');
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Package className="text-blue-600" />
                        Inventory Management
                        {isViewOnly && (
                            <span className="text-sm font-normal text-gray-500 flex items-center gap-1 ml-2">
                                <Eye size={16} /> View Only
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {canManage ? 'Manage your product catalog and specs.' : 'View product catalog and specifications.'}
                    </p>
                </div>
                {canManage ? (
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-200 transition-all font-medium"
                    >
                        <Plus size={18} /> Add Product
                    </button>
                ) : (
                    <div className="bg-gray-100 text-gray-500 px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium cursor-not-allowed">
                        <Lock size={18} /> Read-Only Access
                    </div>
                )}
            </div>

            {showAdd && canManage && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 ring-4 ring-blue-50/50 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold mb-6 text-gray-800 border-b pb-2">Add New Product</h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Product Name</label>
                            <input required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">SKU</label>
                            <input required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <input className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Price ($)</label>
                            <input required type="number" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Min Stock Level</label>
                            <input type="number" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newProduct.minStockLevel} onChange={e => setNewProduct({ ...newProduct, minStockLevel: e.target.value })} />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-4">
                            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">Save Product</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading inventory...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-600 font-medium border-b border-gray-200 text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 px-6">Name / SKU</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Min Stock</th>
                                    {canManage && <th className="p-4 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={canManage ? "5" : "4"} className="p-8 text-center text-gray-400">No products found. {canManage && 'Add one to get started.'}</td>
                                    </tr>
                                ) : products.map(p => (
                                    <tr key={p._id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="p-4 px-6">
                                            <div className="font-semibold text-gray-800">{p.name}</div>
                                            <div className="text-xs text-gray-400 font-mono">{p.sku}</div>
                                        </td>
                                        <td className="p-4 text-gray-600">{p.category || '-'}</td>
                                        <td className="p-4 text-green-600 font-bold font-mono">${p.price}</td>
                                        <td className="p-4 text-gray-600 font-medium flex items-center gap-2">
                                            {p.minStockLevel}
                                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                        </td>
                                        {canManage && (
                                            <td className="p-4 text-right">
                                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
