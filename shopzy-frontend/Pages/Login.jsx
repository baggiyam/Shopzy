import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "../Styles/login.css"

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear any previous errors

        try {
            // Send login request to backend
            const res = await axios.post('http://localhost:5004/api/login', { email, password });
            const token = res.data.token;

            if (token) {
                // If login is successful, save token to localStorage
                localStorage.setItem('token', token);
                console.log("Token saved to localStorage");

                // Navigate to homepage/dashboard after successful login
                navigate('/');
            } else {
                setError('No token returned from server');
            }
        } catch (err) {
            console.error("Login failed:", err);

            // If error response includes "verify your email", handle it
            const errorMsg = err.response?.data?.message || 'Login failed';
            setError(errorMsg);

            // Check if the error message indicates unverified email
            if (errorMsg.includes("verify your email")) {
                // Show the error message, then navigate to verification page after a delay
                setTimeout(() => {
                    // If email is not verified, navigate to the verification page
                    navigate('/verify', { state: { email } });
                }, 1000); // Navigate after 2 seconds for a better user experience
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
