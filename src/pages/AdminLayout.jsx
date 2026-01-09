import React from 'react';
import Navbar from '../components/common/Navbar';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
                <aside className="w-64 bg-white h-[calc(100vh-64px)] shadow-md p-4 hidden md:block">
                    <ul className="space-y-2">
                        <li><Link to="/admin/dashboard" className="block p-2 hover:bg-gray-100 rounded">Dashboard</Link></li>
                        <li><Link to="/admin/analytics" className="block p-2 hover:bg-gray-100 rounded">Analytics</Link></li>
                        <li><Link to="/admin/products" className="block p-2 hover:bg-gray-100 rounded">Manage Products</Link></li>
                    </ul>
                </aside>
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
