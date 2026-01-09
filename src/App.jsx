import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/common/ProtectedRoute';

import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import SalesDashboard from './pages/admin/SalesDashboard';
import ProductManagement from './pages/admin/ProductManagement';

import ShopLayout from './pages/ShopLayout';
import ShopDashboard from './pages/shop/ShopDashboard';
import Billing from './pages/shop/Billing';
import SalesHistory from './pages/shop/SalesHistory';

import Home from './pages/Home';
import Signup from './pages/Signup';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';

// Placeholders for dashboards
const Unauthorized = () => <div className="p-4 text-red-500"><h1>Unauthorized Access</h1></div>;

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="analytics" element={<SalesDashboard />} />
                    <Route path="products" element={<ProductManagement />} />
                </Route>
            </Route>

            {/* Shop Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_SHOP', 'ROLE_ADMIN']} />}>
               <Route path="/shop" element={<ShopLayout />}>
                    <Route path="dashboard" element={<ShopDashboard />} />
                    <Route path="billing" element={<Billing />} />
                    <Route path="history" element={<SalesHistory />} />
               </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
  );
}

export default App;
