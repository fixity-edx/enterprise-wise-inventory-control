import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield, Package, Store, TrendingUp, LayoutDashboard, Users, Eye } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const isActive = (path) => location.pathname === path ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50';

    // Role-based permissions
    const canManageInventory = ['admin', 'inventory_manager'].includes(user.role);
    const canManageBranches = ['admin', 'branch_manager'].includes(user.role);
    const canViewForecast = ['admin', 'inventory_manager', 'analyst', 'procurement_officer'].includes(user.role);
    const canManageUsers = user.role === 'admin';
    const isViewOnly = user.role === 'analyst';

    // Get role display info
    const getRoleInfo = () => {
        const roleConfig = {
            admin: { icon: Shield, color: 'text-purple-600', label: 'Admin', bgColor: 'bg-purple-50' },
            inventory_manager: { icon: Package, color: 'text-blue-600', label: 'Inventory Manager', bgColor: 'bg-blue-50' },
            branch_manager: { icon: Store, color: 'text-green-600', label: 'Branch Manager', bgColor: 'bg-green-50' },
            procurement_officer: { icon: TrendingUp, color: 'text-orange-600', label: 'Procurement', bgColor: 'bg-orange-50' },
            analyst: { icon: Eye, color: 'text-indigo-600', label: 'Analyst', bgColor: 'bg-indigo-50' }
        };
        return roleConfig[user.role] || roleConfig.analyst;
    };

    const roleInfo = getRoleInfo();
    const RoleIcon = roleInfo.icon;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                <Package className="text-blue-600" />
                InventoryAI
            </Link>

            <div className="hidden md:flex items-center gap-2">
                {/* Dashboard - Everyone can see */}
                <Link to="/" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive('/')}`}>
                    <LayoutDashboard size={18} />
                    <span className="font-medium">Dashboard</span>
                </Link>

                {/* Inventory - Admin and Inventory Manager can manage, others view-only */}
                <Link to="/inventory" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive('/inventory')}`}>
                    <Package size={18} />
                    <span className="font-medium">Inventory</span>
                    {isViewOnly && <Eye size={14} className="text-gray-400" />}
                </Link>

                {/* Branches - Admin and Branch Manager only */}
                {canManageBranches && (
                    <Link to="/branches" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive('/branches')}`}>
                        <Store size={18} />
                        <span className="font-medium">Branches</span>
                    </Link>
                )}

                {/* Forecast - Admin, Inventory Manager, Analyst, Procurement */}
                {canViewForecast && (
                    <Link to="/forecast" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive('/forecast')}`}>
                        <TrendingUp size={18} />
                        <span className="font-medium">Forecast</span>
                    </Link>
                )}

                {/* User Management - Admin only */}
                {canManageUsers && (
                    <Link to="/users" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive('/users')}`}>
                        <Users size={18} />
                        <span className="font-medium">Users</span>
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-4">
                <div className={`hidden sm:flex items-center gap-2 text-slate-700 ${roleInfo.bgColor} px-3 py-1.5 rounded-full border border-slate-200/50`}>
                    <RoleIcon size={16} className={roleInfo.color} />
                    <span className="font-medium text-sm">{user.name}</span>
                    <span className="text-xs text-gray-500 ml-1">({roleInfo.label})</span>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
