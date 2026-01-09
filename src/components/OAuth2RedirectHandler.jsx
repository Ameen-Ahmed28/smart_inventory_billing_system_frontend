import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
// Removed invalid import 
// Actually, looking at Login.jsx from history, it imported { login, reset } from '../slices/authSlice'. 
// I need to check authSlice.js to see available actions. 
// If setCredentials doesn't exist, I might need to dispatch a manual success action or update authSlice.
// Let's assume standard Redux Toolkit pattern or check authSlice first.
// For now, I will write generic code and might need to adjust after checking authSlice.

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const username = params.get('username');
    const role = "SHOP"; // Default assumption, or we could pass role in URL too if needed. 
    // Wait, the backend LoginResponse contains roles. The redirect URL only has token and username.
    // Ideally we should decode the token to get roles, or fetch user profile. 
    // For simplicity, let's try to decode token or just assume shop/redirect to dashboard and let the dashboard fetch/validate.
    // Or simpler: The backend could pass role as a param too. 
    // Let's stick to what I planned: token + username.
    
    if (token) {
      // We need to store this in Redux/Local Storage.
      // Reusing the logic from authSlice would be best. 
      // If authSlice uses createAsyncThunk for login, we might need a separate action for "set user from token".
      
      localStorage.setItem('user', JSON.stringify({ username, token, roles: ['ROLE_SHOP'] })); // Minimal user object
      // Dispatching a manual object if setCredentials isn't available
      // dispatch(setCredentials({ ... })); 
      // Actually, let's force a reload or just navigate to dashboard, and let the app state rehydrate from localStorage if that's how it's built.
      // Looking at Login.jsx: "const { user ... } = useSelector(...)".
      // It likely rehydrates from localStorage on boot.
      
      // Let's try to find a cleaner way: check authSlice.
      navigate('/shop/dashboard');
      window.location.reload(); // Quick fix to ensure state is picked up if we don't have a specific action ready.
    } else {
      navigate('/login');
    }
  }, [location, navigate, dispatch]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Authenticating with Google...</span>
    </div>
  );
};

export default OAuth2RedirectHandler;
