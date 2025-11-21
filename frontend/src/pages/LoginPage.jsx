import React, { useState } from 'react';
import { loginUser } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginUser({ email, password });
            localStorage.setItem('token', data.token);
            // Ensure we store the user object safely
            localStorage.setItem('user', JSON.stringify(data.user || {})); 
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 py-6 px-8">
                    <h2 className="text-2xl font-bold text-white text-center">Welcome Back!</h2>
                    <p className="text-blue-100 text-center text-sm mt-1">Sign in to continue your progress</p>
                </div>
                
                <form onSubmit={handleSubmit} className="py-8 px-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="you@example.com"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Password</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="••••••••"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
                    >
                        Sign In
                    </button>
                </form>
                
                <div className="bg-gray-50 py-4 px-8 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;