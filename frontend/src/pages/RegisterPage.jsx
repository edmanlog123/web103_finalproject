import React, { useState } from 'react';
import { registerUser } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await registerUser({ name, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.details || err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-green-800 px-4 py-8">
            <div className="max-w-md w-full">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-4">
                        <span className="text-4xl">🏋️</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-2">Join Rella</h1>
                    <p className="text-green-200 text-lg">Start Your Fitness Journey Today</p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 py-8 px-8">
                        <h2 className="text-3xl font-bold text-white text-center">Create Account</h2>
                        <p className="text-green-100 text-center mt-2">Sign up to begin tracking your workouts</p>
                    </div>

                    <form onSubmit={handleSubmit} className="py-8 px-8 space-y-5">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-red-500 text-xl">⚠️</span>
                                    <p className="text-red-700 text-sm font-medium">{error}</p>
                                </div>
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide">
                                👤 Full Name
                            </label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-gray-700"
                                placeholder="John Doe"
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                disabled={loading}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide">
                                📧 Email Address
                            </label>
                            <input 
                                type="email" 
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-gray-700"
                                placeholder="you@example.com"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                disabled={loading}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide">
                                🔒 Password
                            </label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-gray-700"
                                placeholder="••••••••"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                disabled={loading}
                                minLength="6"
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Password must be at least 6 characters
                            </p>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating Account...
                                </span>
                            ) : (
                                '✓ Create Account'
                            )}
                        </button>
                    </form>
                    
                    <div className="bg-gray-50 py-6 px-8 border-t border-gray-100">
                        <p className="text-center text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-green-600 font-bold hover:text-green-700 hover:underline transition">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-green-200 text-sm mt-8">
                    © 2025 Rella. Track your progress, achieve your goals.
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;