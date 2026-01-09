import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials, reset } from '../slices/authSlice';
import { AlertCircle } from 'lucide-react';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '', // email
    password: '',
    isAdmin: false,
  });

  const { username, password, isAdmin } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
        if(user.roles && user.roles.includes('ROLE_ADMIN')) {
            navigate('/admin/dashboard');
        } else {
            navigate('/shop/dashboard');
        }
    }
    return () => {
         if(isSuccess) dispatch(reset());
    }
  }, [user, isSuccess, navigate, dispatch]);

  const onChange = (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: value,
      }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, username, password);
        const firebaseUser = userCredential.user;
        const accessToken = await firebaseUser.getIdToken();
        
        // Mocking backend user object for now since we haven't connected backend to firebase yet
        // In a real app, send token to backend -> backend verifies -> returns user data
        const role = username === "ameen280305@gmail.com"? "ROLE_ADMIN" : "ROLE_SHOP";
        const userData = {
            username: firebaseUser.email,
            email: firebaseUser.email,
            roles: [role],
            accessToken: accessToken
        };

        dispatch(setCredentials(userData));
        localStorage.setItem("user", JSON.stringify(userData));

    } catch (error) {
        console.error("Firebase Login Error", error);
        // We need to set error in state manually or dispatch an error action
        // For simplicity, just alert or use local state if message not needed in redux
        // But better to use redux if possible. 
        // dispatch(login.rejected(error.message)); // effectively
    }
  };

  const handleGoogleLogin = async () => {
      try {
          const result = await signInWithPopup(auth, googleProvider);
          const firebaseUser = result.user;
          const accessToken = await firebaseUser.getIdToken();

          const role = firebaseUser.email === "ameen280305@gmail.com" ? "ROLE_ADMIN" : "ROLE_SHOP";
          const userData = {
            username: firebaseUser.email,
            email: firebaseUser.email,
            roles: [role],
            accessToken: accessToken
          };

          dispatch(setCredentials(userData));
          localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
          console.error("Google Login Error", error);
      }
  };

  // Override isLoading for UI if needed, or manage locally
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 rounded-2xl bg-white shadow-xl">
        <div className="text-center">
             <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
             <p className="text-gray-500 mt-2">Sign in to Smart Inventory</p>
        </div>

        {/* Error display logic can remain if we map firebase errors to redux state or local state */}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="username"
              value={username}
              onChange={onChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center">
            <input
              id="admin-checkbox"
              type="checkbox"
              name="isAdmin"
              checked={isAdmin}
              onChange={onChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="admin-checkbox" className="ml-2 block text-sm text-gray-700 cursor-pointer select-none">
              Sign in as Admin
            </label>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2.5 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all shadow-lg shadow-blue-500/30"
          >
            Sign In
          </button>
          
          <div className="relative flex items-center justify-center w-full mt-6 border-t border-gray-200">
            <div className="absolute px-3 bg-white text-gray-500 text-sm">Or continue with</div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5 mr-2" />
            Sign in with Google
          </button>
        </form>
        <div className="text-center pt-2 border-t border-gray-100">
             <p className="text-gray-500 text-sm">
                 Don't have an account?{' '}
                 <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-bold ml-1 hover:underline">
                     Sign Up
                 </Link>
             </p>
         </div>
      </div>
    </div>
  );
};

export default Login;
