import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, BarChart3, Settings, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl shadow-xl text-white">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        <ShieldCheck size={32} className="text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Admin Control Center
                        </h1>
                        <p className="text-gray-400 mt-1">Manage inventory, analyze performance, and configure settings.</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/admin/products" className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-md border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBag size={100} className="text-blue-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="p-3 bg-blue-50 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
                            <ShoppingBag className="text-blue-600" size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Management</h2>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-[80%]">
                            Add new items, update pricing, manage stock levels, and organize inventory categories.
                        </p>
                    </div>
                </Link>

                <Link to="/admin/analytics" className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-md border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BarChart3 size={100} className="text-purple-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="p-3 bg-purple-50 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
                            <BarChart3 className="text-purple-600" size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analytics & Reports</h2>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-[80%]">
                            View detailed sales insights, revenue trends, low stock alerts, and business performance metrics.
                        </p>
                    </div>
                </Link>
            </div>

            {/* System Status / Placeholder for future widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-full">
                        <LayoutDashboard className="text-green-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">System Status</p>
                        <p className="text-lg font-bold text-green-600">Operational</p>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-full">
                        <Settings className="text-orange-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Version</p>
                        <p className="text-lg font-bold text-gray-800">v1.2.0 (Pro)</p>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-full">
                        <ShieldCheck className="text-indigo-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Admin Access</p>
                        <p className="text-lg font-bold text-indigo-600">Secure</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
