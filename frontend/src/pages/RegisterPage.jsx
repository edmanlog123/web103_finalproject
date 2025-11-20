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
            // Ensure your backend expects 'name', 'email', 'password'
            // Based on your userController.js: const { name, email, password, role } = req.body
            await registerUser({ name: username, email, password });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error("Registration Error:", error);
            alert('Registration failed. See console for details.');
        }
    };

    return (
        <div className="login-container">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Sign Up</button>
            </form>
            <p style={{marginTop: '20px'}}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default RegisterPage;