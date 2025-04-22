import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';  // Import AuthContext
import "../Styles/login.css";

const LoginPage = () => {
    const { login } = useContext(AuthContext);  // Get login function from context
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Send login request to backend
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, { email, password });
            console.log(res.data); // Check if the token is there
            const token = res.data.token;

            if (token) {
                // If login is successful, save token using login from context
                login(token);  // Store token in context and localStorage

                // Navigate to homepage/dashboard after successful login
                navigate('/');
            } else {
                setError('No token returned from server');
            }
        } catch (err) {
            console.error("Login failed:", err);

            const errorMsg = err.response?.data?.message || 'Login failed';
            setError(errorMsg);

            if (errorMsg.includes("verify your email")) {
                setTimeout(() => {
                    navigate('/verify', { state: { email } });
                }, 1000);
            }
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
                        <br />
                        Forgot your password? <a href="/forgot">Reset it</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
