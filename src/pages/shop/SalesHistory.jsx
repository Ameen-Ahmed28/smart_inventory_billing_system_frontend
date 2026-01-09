import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMySales } from '../../slices/billingSlice';
import { Search, ExternalLink, X, Printer, Download, Banknote, FileText, Package, Eye } from 'lucide-react';
import axios from '../../utils/axiosInstance';

const SalesHistory = () => {
    const dispatch = useDispatch();
    const { bills, isLoading, isError, message } = useSelector((state) => state.billing);
    const [stats, setStats] = useState(null);
    const [selectedBill, setSelectedBill] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getMySales());
        fetchStats();
    }, [dispatch]);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/shop/stats', { headers: { Authorization: `Bearer ${token}` } });
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch shop stats", err);
        }
    };
    
    // Download PDF handler
    const handleDownloadPdf = async (billId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/shop/bill/${billId}/pdf`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice_${billId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("PDF Download failed", error);
            alert("Failed to download PDF");
        }
    };

    if (isLoading) return <div className="p-12 text-center text-lg text-gray-500 animate-pulse">Loading sales records...</div>;
    if (isError) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg m-4">Error: {message}</div>;

    const filteredBills = bills ? bills.filter(b => 
        (b.customerName && b.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.invoiceNo && b.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()))
    ) : [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">Sales History</h1>
                    <p className="text-gray-500 mt-1">Track and manage past transactions</p>
                </div>
                <div>
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by Invoice or Name" 
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 1. Earnings Summary */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                         <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <Banknote size={28} />
                         </div>
                         <div>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Today's Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">₹{stats.todaySales.toLocaleString('en-IN')}</p>
                         </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                         <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <FileText size={28} />
                         </div>
                         <div>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Bills Generated</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.todayBills}</p>
                         </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                         <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Package size={28} />
                         </div>
                         <div>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Items Sold</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.todayUnits}</p>
                         </div>
                    </div>
                </div>
            )}

            {/* 2. Sales Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice Info</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Mode</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {filteredBills.map((bill) => (
                            <tr key={bill.id} className="hover:bg-blue-50/50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-mono text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                                        {bill.invoiceNo || `INV-${bill.id}`}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{bill.customerName}</div>
                                    <div className="text-xs text-gray-500">{bill.customerMobile}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(bill.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 font-medium">
                                    {bill.billItems?.length || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                                    ₹{bill.totalAmount.toLocaleString('en-IN')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block min-w-[60px] text-center
                                        ${bill.paymentMode === 'Cash' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                          bill.paymentMode === 'UPI' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                                          'bg-purple-100 text-purple-700 border border-purple-200'}`}>
                                        {bill.paymentMode || '-'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <div className="flex justify-center gap-3">
                                        <button 
                                            onClick={() => setSelectedBill(bill)} 
                                            className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50 tooltip"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                         <button 
                                            onClick={() => handleDownloadPdf(bill.id)} 
                                            className="text-gray-500 hover:text-green-600 transition-colors p-1 rounded hover:bg-green-50 tooltip"
                                            title="Download Invoice"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBills.length === 0 && (
                    <div className="p-12 text-center text-gray-400 bg-gray-50/30">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Search size={20} className="text-gray-400"/>
                        </div>
                        <p>No sales records match your search.</p>
                    </div>
                )}
            </div>

            {/* 3. Modal */}
            {selectedBill && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Invoice Details</h2>
                                <p className="text-sm text-gray-500 font-mono mt-0.5">{selectedBill.invoiceNo}</p>
                            </div>
                            <button onClick={() => setSelectedBill(null)} className="text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-8 flex-1 overflow-y-auto">
                            {/* Receipt Style Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Customer Info</h3>
                                    <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
                                        <span className="text-gray-500">Name:</span>
                                        <span className="font-semibold text-gray-900">{selectedBill.customerName}</span>
                                        
                                        <span className="text-gray-500">Mobile:</span>
                                        <span className="font-medium text-gray-900">{selectedBill.customerMobile}</span>

                                        <span className="text-gray-500">Address:</span>
                                        <span className="text-gray-700">{selectedBill.customerAddress || '-'}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Payment Info</h3>
                                     <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
                                        <span className="text-gray-500">Method:</span>
                                        <span className="font-semibold text-gray-900">{selectedBill.paymentMode}</span>
                                        
                                        <span className="text-gray-500">Trans ID:</span>
                                        <span className="font-mono text-gray-700 bg-gray-50 px-1 rounded inline-block w-fit">{selectedBill.transactionId || 'N/A'}</span>

                                        <span className="text-gray-500">Date:</span>
                                        <span className="text-gray-700">{new Date(selectedBill.createdAt).toLocaleString()}</span>
                                     </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden mb-8">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-100 border-b border-gray-200">
                                        <tr>
                                            <th className="p-4 text-left font-semibold text-gray-600">Item Details</th>
                                            <th className="p-4 text-center font-semibold text-gray-600">Quantity</th>
                                            <th className="p-4 text-right font-semibold text-gray-600">Unit Price</th>
                                            <th className="p-4 text-right font-semibold text-gray-600">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {selectedBill.billItems.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-900">{item.product.name}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{item.product.brand} {item.product.model}</div>
                                                     {item.imeiSerial && <div className="text-[10px] text-gray-400 mt-1 font-mono">SN: {item.imeiSerial}</div>}
                                                </td>
                                                <td className="p-4 text-center text-gray-700">{item.quantity}</td>
                                                <td className="p-4 text-right text-gray-700">₹{item.price.toLocaleString()}</td>
                                                <td className="p-4 text-right font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Totals Section */}
                            <div className="flex justify-end">
                                <div className="w-72 bg-gray-50 p-6 rounded-xl space-y-3">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{selectedBill.subTotal?.toLocaleString() || 0}</span>
                                    </div>
                                    {selectedBill.discount > 0 && (
                                        <div className="flex justify-between text-sm text-red-500">
                                            <span>Discount</span>
                                            <span>- ₹{selectedBill.discount?.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm text-gray-600 border-b border-gray-200 pb-3">
                                        <span>Tax (Est.)</span>
                                        <span>₹{selectedBill.taxAmount?.toLocaleString() || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-1">
                                        <span>Total Paid</span>
                                        <span>₹{selectedBill.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                            <button onClick={() => handleDownloadPdf(selectedBill.id)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-medium">
                                <Printer size={18} /> Print / Download
                            </button>
                            <button onClick={() => setSelectedBill(null)} className="px-5 py-2.5 border bg-white rounded-lg hover:bg-gray-100 transition font-medium text-gray-700">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesHistory;
