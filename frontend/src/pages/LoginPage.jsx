import React, { useState } from 'react';
import { loginUser } from '../services/auth'; // FIXED: Changed 'api' to 'auth'
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser({ email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            alert('Login Successful!');
            navigate('/');
            window.location.reload(); // Updates the navbar after login
        } catch (error) {
            console.error("Login Error:", error); // This prints the real error to the console
            alert('Login failed. Check console for details.');
        }
    };

    return (
        <div className="login-container">
            <h2>Welcome Back</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
            </form>
            {/* ADDED: Link to Register Page */}
            <p style={{marginTop: '20px'}}>
                New here? <Link to="/register">Sign Up</Link>
            </p>
        </div>
    );
};

export default LoginPage;