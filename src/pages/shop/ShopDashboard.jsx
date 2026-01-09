import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../slices/productSlice';
import { Package, AlertTriangle, PlusCircle, History, TrendingUp } from 'lucide-react';

const ShopDashboard = () => {
    const dispatch = useDispatch();
    const { products, isLoading } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            dispatch(getProducts());
        }
    }, [dispatch, user]);

    const lowStockCount = products.filter(p => p.quantity <= (p.minThreshold !== undefined && p.minThreshold !== null ? p.minThreshold : 5)).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
                        Shop Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Overview of inventory and quick actions</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/shop/billing" className="group bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">New Bill</h2>
                        <p className="text-blue-100 mt-1 text-sm">Create invoice for customer</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <PlusCircle size={32} />
                    </div>
                </Link>
                <Link to="/shop/history" className="group bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Sales History</h2>
                        <p className="text-orange-100 mt-1 text-sm">View past transactions</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <History size={32} />
                    </div>
                </Link>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50 flex items-center gap-4 transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shadow-inner">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Products</p>
                        <p className="text-3xl font-bold text-gray-800">{isLoading ? '-' : products.length}</p>
                    </div>
                </div>
                
                <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50 flex items-center gap-4 transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className="p-3 bg-red-100 text-red-600 rounded-xl shadow-inner">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Low Stock Items</p>
                        <p className="text-3xl font-bold text-red-600">{isLoading ? '-' : lowStockCount}</p>
                    </div>
                </div>

                 <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50 flex items-center gap-4 transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className="p-3 bg-green-100 text-green-600 rounded-xl shadow-inner">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">System Status</p>
                        <p className="text-lg font-bold text-green-600">Active</p>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Package size={20} className="text-gray-400"/>
                        Current Inventory
                    </h2>
                    {isLoading && <span className="text-sm text-blue-500 animate-pulse">Updating...</span>}
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                                <th className="p-4">Product Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Brand / Model</th>
                                <th className="p-4 text-right">Price</th>
                                <th className="p-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading inventory data...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No products found in inventory.</td></tr>
                            ) : (
                                products.map((product) => {
                                    const isLowStock = product.quantity <= (product.minThreshold || 5);
                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50/80 transition-colors duration-150 group">
                                            <td className="p-4 font-medium text-gray-900">{product.name}</td>
                                            <td className="p-4 text-gray-500">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-500 text-sm">{product.brand} <span className="text-gray-400">/</span> {product.model}</td>
                                            <td className="p-4 text-right font-medium text-gray-900">₹{product.price.toLocaleString()}</td>
                                            <td className="p-4 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                                                    ${isLowStock ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}
                                                `}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isLowStock ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                                    {isLowStock ? `Low: ${product.quantity}` : `${product.quantity} in Stock`}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShopDashboard;
