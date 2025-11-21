import React, { useState } from 'react';
import { registerUser } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Sending name, email, password. Role defaults to 'athlete' in backend
            await registerUser({ name, email, password });
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            // Display the actual error from backend
            setError(err.response?.data?.details || err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-green-600 py-6 px-8">
                    <h2 className="text-2xl font-bold text-white text-center">Join Rella</h2>
                    <p className="text-green-100 text-center text-sm mt-1">Start tracking your workouts today</p>
                </div>

                <form onSubmit={handleSubmit} className="py-8 px-8 space-y-5">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            placeholder="John Doe"
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            placeholder="••••••••"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
                    >
                        Create Account
                    </button>
                </form>
                
                <div className="bg-gray-50 py-4 px-8 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="text-green-600 font-bold hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;