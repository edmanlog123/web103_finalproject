import React, { useState } from 'react';
import { registerUser } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ username, email, password });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert('Registration failed. Email might be taken.');
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-bold text-center mb-6 text-green-600">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input 
                            type="email" 
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200">
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-500 font-bold">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;