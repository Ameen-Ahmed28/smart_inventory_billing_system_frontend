import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardData } from '../../slices/reportSlice';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AlertCircle, IndianRupee, ShoppingBag, FileText, TrendingUp, ArrowUpRight } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesDashboard = () => {
    const dispatch = useDispatch();
    const { dashboardData, isLoading, isError, message } = useSelector((state) => state.reports);

    useEffect(() => {
        dispatch(getDashboardData());
    }, [dispatch]);

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
    
    if (isError) return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700">
            <p className="font-bold">Error Loading Dashboard</p>
            <p>{message}</p>
        </div>
    );

    if (!dashboardData) return null;

    const { totalRevenue, totalBills, totalUnitsSold, totalGstCollected, dailySales, topProducts, lowStockItems } = dashboardData;

    // Chart Data Preparation
    const dates = dailySales.map(d => d.date);
    const revenueData = dailySales.map(d => d.revenue);

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: 'Daily Revenue',
                data: revenueData,
                borderColor: 'rgb(99, 102, 241)', // Indigo-500
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(99, 102, 241)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(99, 102, 241)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { usePointStyle: true, boxWidth: 8 }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 12,
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { borderDash: [4, 4], color: '#f3f4f6' } }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Sales Overview</h1>
                    <p className="text-gray-500 mt-1">Real-time insights and performance metrics.</p>
                </div>
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                    Last 30 Days
                </div>
            </div>

            {/* 1. Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} icon={<IndianRupee />} color="bg-blue-500" />
                <StatCard title="Total Bills" value={totalBills} icon={<FileText />} color="bg-green-500" />
                <StatCard title="Units Sold" value={totalUnitsSold} icon={<ShoppingBag />} color="bg-orange-500" />
                <StatCard title="GST Collected" value={`₹${totalGstCollected.toFixed(2)}`} icon={<TrendingUp />} color="bg-purple-500" />
            </div>

            {/* 2. Charts Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Revenue Trends</h2>
                    <ArrowUpRight className="text-gray-400" size={20} />
                </div>
                <div className="h-[350px]">
                    <Line options={chartOptions} data={chartData} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 3. Top Selling Products */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                         <h2 className="text-lg font-bold text-gray-800">Top Selling Products</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500">
                                <tr>
                                    <th className="p-4 pl-6">Rank</th>
                                    <th className="p-4">Product</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Units</th>
                                    <th className="p-4 pr-6 text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product, index) => (
                                    <tr key={index} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 pl-6 font-bold text-gray-400">#{index + 1}</td>
                                        <td className="p-4 font-medium text-gray-800">{product.productName}</td>
                                        <td className="p-4 text-sm text-gray-500">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">{product.category}</span>
                                        </td>
                                        <td className="p-4 text-gray-600 font-medium">{product.unitsSold}</td>
                                        <td className="p-4 pr-6 text-right font-semibold text-gray-800">₹{product.revenue.toFixed(2)}</td>
                                    </tr>
                                ))}
                                {topProducts.length === 0 && (
                                     <tr><td colSpan="5" className="p-8 text-center text-gray-400">No sales data available yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. Low Stock Alerts */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                        <AlertCircle className="text-red-500" size={20} />
                        <h2 className="text-lg font-bold text-gray-800">Low Stock Alerts</h2>
                    </div>
                    
                    <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
                        {lowStockItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <ShoppingBag size={48} className="mb-3 opacity-20" />
                                <p>Everything looks good!</p>
                                <p className="text-sm">No low stock items found.</p>
                            </div>
                        ) : (
                            lowStockItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-4 bg-red-50 rounded-xl border border-red-100 group hover:border-red-200 transition-all">
                                    <div>
                                        <p className="font-bold text-gray-800 group-hover:text-red-700 transition-colors">{item.productName}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-sm text-red-600 font-bold">Only {item.currentStock} left</p>
                                            <span className="text-xs text-red-400">•</span>
                                            <p className="text-xs text-gray-500">Threshold: {item.threshold}</p>
                                        </div>
                                    </div>
                                    <button className="px-3 py-1.5 bg-white text-red-600 border border-red-200 text-xs font-bold rounded-lg shadow-sm hover:bg-red-50 transition">
                                        Restock
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Polished Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl text-white shadow-lg shadow-${color.replace('bg-', '')}/30 ${color}`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Metric</span>
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">{title}</p>
        </div>
    </div>
);

export default SalesDashboard;
