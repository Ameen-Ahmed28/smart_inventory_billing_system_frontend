import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../slices/productSlice';
import { addToCart, removeFromCart, createBill, reset } from '../../slices/billingSlice';
import { X, Printer, Download, ShoppingCart, Search, CreditCard, User, Smartphone, Mail, MapPin } from 'lucide-react'; 
import axios from '../../utils/axiosInstance';

const Billing = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { cart, isLoading, isSuccess, isError, message, createdBillId, createdBill } = useSelector((state) => state.billing);

    useEffect(() => {
        dispatch(getProducts());
        if(isSuccess && createdBillId) {
            // Trigger download
            const token = localStorage.getItem('token'); 
            
            axios.get(`/shop/bill/${createdBillId}/pdf`, {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob'
            })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = `bill_${createdBillId}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(err => {
                console.error("Error downloading PDF", err);
                alert("Failed to download PDF, but bill was created.");
            });
        }
        if(isError) {
            alert(message);
            dispatch(reset());
        }
    }, [dispatch, isSuccess, isError, message, createdBillId]);

    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('All');

    // Extract unique categories
    const categories = ['All', ...new Set(products.map(product => product.category))];

    const [selectedQuantities, setSelectedQuantities] = React.useState({});

    const handleQuantityChange = (productId, change, max) => {
        setSelectedQuantities(prev => {
            const current = prev[productId] || 1;
            const newValue = current + change;
            if (newValue < 1) return prev;
            if (newValue > max) return prev;
            return { ...prev, [productId]: newValue };
        });
    };

    const handleAddToCart = (product) => {
        const qty = selectedQuantities[product.id] || 1;
        dispatch(addToCart({ ...product, productId: product.id, quantity: qty }));
        // Reset counter after adding
        setSelectedQuantities(prev => ({ ...prev, [product.id]: 1 }));
    };

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const [customerName, setCustomerName] = React.useState('');
    const [customerMobile, setCustomerMobile] = React.useState('');
    const [customerEmail, setCustomerEmail] = React.useState('');
    const [customerAddress, setCustomerAddress] = React.useState('');
    const [paymentMode, setPaymentMode] = React.useState('Cash');
    const [transactionId, setTransactionId] = React.useState('');
    const [discount, setDiscount] = React.useState('');
    const [itemImeis, setItemImeis] = React.useState({});

    const handleImeiChange = (productId, value) => {
        setItemImeis(prev => ({ ...prev, [productId]: value }));
    };

    const handleCreateBill = () => {
        if (!customerName || !customerMobile) {
            alert("Please enter Customer Name and Mobile Number");
            return;
        }
        const billData = {
            customerName,
            customerMobile,
            customerEmail,
            customerAddress,
            paymentMode,
            transactionId,
            discount: parseFloat(discount) || 0,
            items: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                imeiSerial: itemImeis[item.productId] || ''
            }))
        };
        dispatch(createBill(billData));
    };

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">
            {/* Left Side: Product Selection */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                <div className="flex justify-between items-end border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">New Bill</h2>
                        <p className="text-gray-500 text-sm">Select products to add to cart</p>
                    </div>
                </div>
                
                {/* Search and Filters */}
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search products by name..." 
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow outline-none shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(category => (
                            <button 
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                                    selectedCategory === category 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid - Scrollable */}
                <div className="flex-1 overflow-y-auto pr-2 pb-4">
                    {filteredProducts.length === 0 ? (
                        <div className="h-40 flex items-center justify-center text-gray-500">
                            No products found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredProducts.map(product => {
                                const isOutOfStock = (product.quantity || 0) <= 0;
                                return (
                                    <div key={product.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-800 line-clamp-1" title={product.name}>{product.name}</h3>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{product.category}</p>
                                            </div>
                                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                                                {product.brand}
                                            </span>
                                        </div>
                                        
                                        <div className="mt-auto pt-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <p className="text-lg font-bold text-blue-600">₹{product.price.toLocaleString()}</p>
                                                <p className={`text-xs font-semibold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                                                    {isOutOfStock ? 'Out of Stock' : `${product.quantity} Left`}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {/* Quantity Stepper */}
                                                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                                    <button 
                                                        onClick={() => handleQuantityChange(product.id, -1, product.quantity || 0)}
                                                        className="px-3 py-1 hover:bg-gray-200 rounded-l-lg text-gray-600 disabled:opacity-50"
                                                        disabled={isOutOfStock}
                                                    >-</button>
                                                    <span className="w-8 text-center font-medium text-sm">{selectedQuantities[product.id] || 1}</span>
                                                    <button 
                                                        onClick={() => handleQuantityChange(product.id, 1, product.quantity || 0)}
                                                        className="px-3 py-1 hover:bg-gray-200 rounded-r-lg text-gray-600 disabled:opacity-50"
                                                        disabled={isOutOfStock}
                                                    >+</button>
                                                </div>

                                                <button 
                                                    onClick={() => handleAddToCart(product)}
                                                    className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                                        !isOutOfStock
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800' 
                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    disabled={isOutOfStock}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Cart & Checkout (Sticky/Full Height) */}
            <div className="w-full lg:w-[400px] xl:w-[450px] bg-white rounded-2xl shadow-xl flex flex-col h-full overflow-hidden border border-gray-100 flex-shrink-0">
                <div className="p-5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <ShoppingCart size={20} className="text-blue-600"/>
                        Current Bills
                    </h2>
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                        {cart.length} items
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Customer Details Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Details</h3>
                        <div className="space-y-3">
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Customer Name *" 
                                    className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-3 text-gray-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Mobile Number *" 
                                    className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={customerMobile}
                                    onChange={(e) => setCustomerMobile(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                 <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <input 
                                        type="email" 
                                        placeholder="Email (Optional)" 
                                        className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                                <textarea 
                                    placeholder="Address (Optional)" 
                                    className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    rows="2"
                                    value={customerAddress}
                                    onChange={(e) => setCustomerAddress(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cart Items</h3>
                        <div className="space-y-3">
                            {cart.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                    <p className="text-gray-400 text-sm">Cart is empty</p>
                                    <p className="text-gray-400 text-xs mt-1">Add items from the left</p>
                                </div>
                            ) : cart.map((item, index) => (
                                <div key={index} className="bg-white border p-3 rounded-lg shadow-sm group hover:border-blue-200 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                                            <div className="text-xs text-gray-500 mt-1 flex gap-2">
                                                <span>qty: {item.quantity}</span>
                                                <span>•</span>
                                                <span>₹{item.price} each</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800 text-sm">₹{item.price * item.quantity}</p>
                                            <button 
                                                onClick={() => dispatch(removeFromCart(item.productId))} 
                                                className="text-red-500 text-xs hover:text-red-700 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >Remove</button>
                                        </div>
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="IMEI / Serial No." 
                                        className="w-full p-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                        value={itemImeis[item.productId] || ''}
                                        onChange={(e) => handleImeiChange(item.productId, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Payment</h3>
                        <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="text-xs text-gray-500 mb-1 block">Mode</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                                    <select 
                                        className="w-full pl-8 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                                        value={paymentMode}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Card">Card</option>
                                        <option value="EMI">EMI</option>
                                    </select>
                                </div>
                             </div>
                             <div>
                                <label className="text-xs text-gray-500 mb-1 block">Discount</label>
                                <input 
                                    type="number" 
                                    placeholder="₹ 0.00" 
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                />
                             </div>
                        </div>
                        {paymentMode !== 'Cash' && (
                             <input 
                                type="text" 
                                placeholder="Transaction Ref ID" 
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                            />
                         )}
                    </div>
                </div>

                {/* Footer Totals & Action */}
                <div className="p-5 bg-gray-50 border-t border-gray-200 space-y-3">
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-gray-600">
                             <span>Subtotal</span>
                             <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between text-gray-600">
                             <span>GST (Approx)</span>
                             <span>₹{cart.reduce((acc, item) => acc + (item.price * item.quantity * (item.gstRate || 0)/100), 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-500">
                             <span>Discount</span>
                             <span>- ₹{parseFloat(discount || 0).toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-end border-t border-gray-200 pt-3">
                        <span className="text-gray-800 font-bold">Total Amount</span>
                        <span className="text-2xl font-extrabold text-blue-600">
                            ₹{(totalAmount + cart.reduce((acc, item) => acc + (item.price * item.quantity * (item.gstRate || 0)/100), 0) - (parseFloat(discount) || 0)).toFixed(2)}
                        </span>
                    </div>

                    <button 
                        onClick={handleCreateBill}
                        disabled={cart.length === 0 || isLoading}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-gray-400 disabled:scale-100 shadow-lg shadow-blue-200"
                    >
                        {isLoading ? 'Generating Invoice...' : 'Generate Bill & Print'}
                    </button>
                </div>
            </div>

            {/* Success Modal */}
            {isSuccess && createdBill && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                        <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                    <div className="bg-white rounded-full p-1 text-green-600">
                                        <X size={12} className="rotate-45"/> 
                                    </div>
                                    Bill Created Successfully!
                                </h2>
                                <p className="text-green-100 text-xs mt-1 opacity-90">#{createdBill.invoiceNo || `INV-${createdBill.id}`}</p>
                            </div>
                            <button onClick={() => dispatch(reset())} className="text-white/80 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                            {/* Receipt Preview Look */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-xl mx-auto">
                                <div className="text-center border-b border-gray-100 pb-4 mb-4">
                                    <h3 className="font-bold text-xl text-gray-800">TAX INVOICE</h3>
                                    <p className="text-gray-500 text-sm">Original Recipient</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase mb-1">Billed To</p>
                                        <p className="font-bold text-gray-800">{createdBill.customerName}</p>
                                        <p className="text-gray-600">{createdBill.customerMobile}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-500 text-xs uppercase mb-1">Invoice Details</p>
                                        <p className="font-semibold text-gray-700">Date: {new Date().toLocaleDateString()}</p>
                                        <p className="font-semibold text-gray-700">Mode: {createdBill.paymentMode}</p>
                                    </div>
                                </div>

                                <table className="w-full text-sm mb-6">
                                    <thead className="bg-gray-50 border-y border-gray-200">
                                        <tr>
                                            <th className="py-2 text-left font-semibold text-gray-600">Item</th>
                                            <th className="py-2 text-center font-semibold text-gray-600">Qty</th>
                                            <th className="py-2 text-right font-semibold text-gray-600">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {createdBill.billItems && createdBill.billItems.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="py-3">
                                                    <p className="font-medium text-gray-800">{item.product.name}</p>
                                                    <p className="text-xs text-gray-500">{item.product.brand}</p>
                                                    {item.imeiSerial && <p className="text-[10px] bg-gray-100 inline-block px-1 rounded mt-0.5 font-mono">#{item.imeiSerial}</p>}
                                                </td>
                                                <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                                                <td className="py-3 text-right font-medium text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="border-t border-gray-200 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{createdBill.subTotal?.toLocaleString()}</span>
                                    </div>
                                    {createdBill.discount > 0 && (
                                        <div className="flex justify-between text-sm text-red-500">
                                            <span>Discount</span>
                                            <span>- ₹{createdBill.discount?.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-lg text-gray-800 border-t border-dashed border-gray-300 pt-2 mt-2">
                                        <span>Total</span>
                                        <span>₹{createdBill.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-white border-t flex justify-end gap-3 z-10">
                            <button onClick={() => {
                                const token = localStorage.getItem('token');
                                axios.get(`/shop/bill/${createdBill.id}/pdf`, {
                                    headers: { 'Authorization': `Bearer ${token}` },
                                    responseType: 'blob'
                                })
                                .then(response => {
                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `bill_${createdBill.id}.pdf`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                });
                            }} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                                <Download size={18} /> Download
                            </button>
                            <button onClick={() => dispatch(reset())} className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium">
                                Close & New Bill
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billing;
