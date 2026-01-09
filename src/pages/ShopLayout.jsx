import React from 'react';
import Navbar from '../components/common/Navbar';
import { Outlet, Link } from 'react-router-dom';

const ShopLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Decorative Background Elements (The 'Outplash') */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-teal-400/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10">
                <Navbar />
                <div className="container mx-auto p-6">
                    <div className="flex gap-4 mb-6">
                        <Link to="/shop/dashboard" className="px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-white/50 text-blue-700 font-semibold rounded-xl shadow-sm hover:bg-white transition-all">Dashboard</Link>
                        <Link to="/shop/billing" className="px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-white/50 text-blue-700 font-semibold rounded-xl shadow-sm hover:bg-white transition-all">New Bill</Link>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ShopLayout;
