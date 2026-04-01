import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Store, MapPin, Plus, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Branches = () => {
    const { user } = useAuth();
    const [branches, setBranches] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newBranch, setNewBranch] = useState({ name: '', location: '' });

    // Role-based permissions
    const canManage = ['admin', 'branch_manager'].includes(user?.role);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/branches');
            setBranches(res.data);
        } catch (err) {
            console.error("Failed to fetch branches");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!canManage) {
            alert('You do not have permission to manage branches');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/branches', newBranch);
            setShowAdd(false);
            setNewBranch({ name: '', location: '' });
            fetchBranches();
        } catch (err) {
            console.error("Failed to add branch");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Store className="text-indigo-600" />
                    Branch Network
                </h1>
                {canManage ? (
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all font-medium"
                    >
                        <Plus size={18} /> Add Branch
                    </button>
                ) : (
                    <div className="bg-gray-100 text-gray-500 px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium cursor-not-allowed">
                        <Lock size={18} /> Admin/Manager Only
                    </div>
                )}
            </div>

            {showAdd && canManage && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 ring-4 ring-indigo-50/50 animate-in fade-in slide-in-from-top-4 max-w-lg mx-auto">
                    <h3 className="text-lg font-bold mb-6 text-gray-800 border-b pb-2">New Branch Location</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Branch Name</label>
                            <input required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. Downtown Hub"
                                value={newBranch.name} onChange={e => setNewBranch({ ...newBranch, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Location / Address</label>
                            <input required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. 123 Main St, New York"
                                value={newBranch.location} onChange={e => setNewBranch({ ...newBranch, location: e.target.value })} />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium">Create Branch</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.length === 0 ? (
                    <div className="col-span-full p-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <Store className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500 text-lg">No branches found. Expand your network by adding one!</p>
                    </div>
                ) : branches.map(branch => (
                    <div key={branch._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-10 -mt-10 group-hover:bg-indigo-100 transition-colors"></div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{branch.name}</h3>
                            <div className="flex items-center gap-2 text-gray-500 mb-4">
                                <MapPin size={16} />
                                <span>{branch.location}</span>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">ACTIVE</span>
                                <button className="text-gray-400 hover:text-indigo-600 text-sm font-medium">View Stock →</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Branches;
