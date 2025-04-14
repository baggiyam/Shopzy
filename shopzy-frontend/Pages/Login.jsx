import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../Styles/login.css"
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5004/api/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/'); // redirect to homepage or dashboard
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Sign in to Shopzy</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleLogin} className="login-form">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button">Login</button>
                    <p className="login-footer">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                        Forgot your password? <a href="/forgot">Reset it</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
