import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { setCredentials } from '../slices/authSlice';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { username, email, password, confirmPassword } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const accessToken = await firebaseUser.getIdToken();

      // Similar to login, we mock the user data structure expected by our app
      const role = email === "ameen280305@gmail.com" ? "ROLE_ADMIN" : "ROLE_SHOP";
      const userData = {
        username: username, // User provided username
        email: email,
        roles: [role], 
        accessToken: accessToken
      };

      setSuccess("Registration successful! Redirecting to login...");
      
      // In a real app we might auto-login or ask to login.
      // Since Login page handles login, let's just redirect.
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignup = async () => {
      try {
          // Verify what happens if user exists? Firebase handles it (logs them in or merges)
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
          navigate('/shop/dashboard');

      } catch (error) {
          console.error("Google Signup Error", error);
          setError(error.message);
      }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg">
        <h1 className="text-2xl font-bold text-center">Create Account</h1>
        <p className="text-center text-gray-500">Sign up for Smart Inventory</p>
        
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}

        <form onSubmit={onSubmit} className="space-y-6 mt-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Choose a username"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Choose a password"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Confirm password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none transition-colors"
          >
            Sign Up
          </button>

          <div className="relative flex items-center justify-center w-full mt-6 border-t border-gray-200">
            <div className="absolute px-3 bg-white text-gray-500 text-sm">Or continue with</div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5 mr-2" />
            Sign up with Google
          </button>
        </form>
        
        <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Sign In
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
