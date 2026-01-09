import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../slices/authSlice';
import { LogOut, Bell } from 'lucide-react';
import { getDashboardData } from '../../slices/reportSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { dashboardData } = useSelector((state) => state.reports);

    React.useEffect(() => {
        if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
           dispatch(getDashboardData());
        }
    }, [user, dispatch]);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };
    
    const alertCount = dashboardData?.lowStockItems?.length || 0;

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center px-6 shadow-md">
            <Link to="/" className="text-xl font-bold tracking-wide">Smart Inventory</Link>
            <div className="flex items-center gap-6">
                {user && user.roles.includes('ROLE_ADMIN') && (
                    <Link to="/admin/analytics" className="relative cursor-pointer hover:text-gray-300 transition">
                         <Bell size={24} />
                         {alertCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                {alertCount}
                            </span>
                         )}
                    </Link>
                )}
            
                {user ? (
                    <div className="flex items-center gap-4">
                         <span className="text-sm font-medium text-gray-300">Welcome, {user.username}</span>
                        <button onClick={onLogout} className="flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded hover:bg-red-700 transition text-sm font-semibold shadow-sm">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 font-semibold shadow-sm text-sm">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
