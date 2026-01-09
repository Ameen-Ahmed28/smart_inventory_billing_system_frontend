import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSales } from '../../slices/salesSlice';

const SalesReport = () => {
    const dispatch = useDispatch();
    const { sales, isLoading, isError, message } = useSelector((state) => state.sales || {});

    useEffect(() => {
        dispatch(getAllSales());
    }, [dispatch]);

    const salesList = Array.isArray(sales) ? sales : [];
    const totalRevenue = salesList.reduce((acc, bill) => acc + (bill.totalAmount || 0), 0);

    if (isLoading) return <div className="p-4">Loading sales report...</div>;
    if (isError) return <div className="p-4 text-red-500">Error: {message}</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Sales Report</h1>

            {/* Summary Card */}
            <div className="bg-white p-6 rounded shadow-md w-full md:w-1/3">
                <h2 className="text-gray-500 font-semibold uppercase text-sm">Total Revenue</h2>
                <p className="text-3xl font-bold text-green-600 mt-2">₹{totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">Total Bills Generated: {salesList.length}</p>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">Bill ID</th>
                            <th className="p-3">Customer Name</th>
                            <th className="p-3">Mobile No</th>
                             <th className="p-3">Items</th>
                            <th className="p-3">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesList.map((bill) => (
                            <tr key={bill.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">#{bill.id}</td>
                                <td className="p-3">{bill.customerName}</td>
                                <td className="p-3">{bill.customerMobile}</td>
                                <td className="p-3">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                                        {(bill.billItems || []).length} Items
                                    </span>
                                </td>
                                <td className="p-3 font-bold text-green-600">₹{bill.totalAmount}</td>
                            </tr>
                        ))}
                        {salesList.length === 0 && (
                            <tr><td colSpan="5" className="p-4 text-center">No sales records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesReport;
