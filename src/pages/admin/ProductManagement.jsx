import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, getAdminProducts, deleteProduct, updateProduct } from '../../slices/productSlice';
import { Trash2, Edit, Plus, X, Search, Package, Filter, MoreHorizontal, AlertCircle } from 'lucide-react';

const ProductManagement = () => {
    const dispatch = useDispatch();
    const { products, isLoading, isError, message } = useSelector((state) => state.products);

    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        brand: '',
        model: '',
        gstRate: '',
        minThreshold: '',
        description: ''
    });

    useEffect(() => {
        // Use the Admin-specific action to avoid 401 errors
        dispatch(getAdminProducts());
    }, [dispatch]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({ name: '', category: '', price: '', quantity: '', brand: '', model: '', gstRate: '', minThreshold: '', description: '' });
        setEditId(null);
    };

    const onEdit = (product) => {
        setEditId(product.id);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: product.quantity || 0,
            brand: product.brand || '',
            model: product.model || '',
            gstRate: product.gstRate || '',
            minThreshold: product.minThreshold || 5,
            description: product.description || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity),
            gstRate: parseFloat(formData.gstRate || 0),
            minThreshold: parseInt(formData.minThreshold || 5)
        };

        if (editId) {
            dispatch(updateProduct({ id: editId, productData })).then(() => {
                dispatch(getAdminProducts());
                resetForm();
            });
        } else {
            dispatch(createProduct(productData)).then(() => {
                dispatch(getAdminProducts());
                resetForm();
            });
        }
    };

    const onDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id)); // Delete action returns the ID, handled in reducer
        }
    };

    // Filter products
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading && products.length === 0) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
                    <p className="text-gray-500 mt-1">Add, update, and organize your inventory.</p>
                </div>
            </div>

            {/* ERROR DISPLAY */}
            {isError && (
                 <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700">
                    <p className="font-bold">Error</p>
                    <p>{message}</p>
                </div>
            )}

            {/* Add/Edit Product Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {editId ? <Edit size={20} className="text-blue-500"/> : <Plus size={20} className="text-green-500"/>}
                        {editId ? 'Update Product' : 'Add New Product'}
                    </h2>
                    {editId && (
                        <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                            <X size={16} /> Cancel Edit
                        </button>
                    )}
                </div>
                
                <form onSubmit={onSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Basic Info */}
                    <div className="lg:col-span-4 pb-2 border-b border-gray-100 mb-2">
                         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Basic Information</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Product Name *</label>
                        <input name="name" value={formData.name} onChange={onChange} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="e.g. Wireless Mouse" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Category *</label>
                        <input name="category" value={formData.category} onChange={onChange} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="e.g. Electronics" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Brand</label>
                        <input name="brand" value={formData.brand} onChange={onChange} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="e.g. Logitech" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Model</label>
                        <input name="model" value={formData.model} onChange={onChange} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="e.g. MX Master 3" />
                    </div>

                    {/* Pricing & Stock */}
                    <div className="lg:col-span-4 pb-2 border-b border-gray-100 mb-2 mt-2">
                         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pricing & Inventory</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Price (₹) *</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                            <input name="price" type="number" step="0.01" value={formData.price} onChange={onChange} className="w-full border border-gray-200 p-2.5 pl-8 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="0.00" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">GST Rate (%)</label>
                         <input name="gstRate" type="number" step="0.1" value={formData.gstRate} onChange={onChange} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="e.g. 18" />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Quantity *</label>
                        <input name="quantity" type="number" value={formData.quantity} onChange={onChange} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="0" required />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Min Threshold</label>
                        <input name="minThreshold" type="number" value={formData.minThreshold} onChange={onChange} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="5" />
                    </div>

                    <div className="md:col-span-2 lg:col-span-4 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={onChange} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" rows="2" placeholder="Product details..."></textarea>
                    </div>

                    <div className="md:col-span-2 lg:col-span-4 pt-4 border-t border-gray-100 flex gap-3">
                        <button type="submit" className={`px-6 py-2.5 rounded-lg text-white font-medium shadow-lg shadow-blue-500/30 transition-transform active:scale-95 ${editId ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'}`}>
                            {editId ? 'Update Product' : 'Add Product'}
                        </button>
                         {editId && (
                            <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div className="flex items-center gap-2">
                        <Package className="text-blue-500" />
                        <h2 className="text-lg font-bold text-gray-800">Inventory List</h2>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{products.length} Items</span>
                     </div>
                     
                     <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                        />
                     </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price (₹)</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">GST</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div>
                                            <p className="font-bold text-gray-800">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.brand} {product.model}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{product.category}</span>
                                    </td>
                                    <td className="p-4 font-mono font-medium text-gray-700">₹{product.price}</td>
                                    <td className="p-4 text-sm text-gray-600">{product.gstRate ? `${product.gstRate}%` : '-'}</td>
                                    <td className="p-4">
                                        <div className={`flex items-center gap-2 ${product.quantity <= (product.minThreshold || 5) ? 'text-red-600 font-bold' : 'text-green-600 font-medium'}`}>
                                            {product.quantity}
                                            {product.quantity <= (product.minThreshold || 5) && <AlertCircle size={14} />}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onEdit(product)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => onDelete(product.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-400">No products found matching your search.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
