import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "../Styles/login.css"; // Keeping your existing CSS

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // For showing any message from the backend
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }
    };

    // Handle login request
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setMessage(""); // Clear message

        try {
            // Send login request to backend
            const res = await axios.post('http://localhost:5004/api/login', { email, password });

            const token = res.data.token;

            if (token) {
                // If login is successful, save token and navigate
                localStorage.setItem('token', token);
                console.log("Token saved to localStorage");
                navigate('/'); // Redirect to homepage/dashboard
            } else {
                setError('No token returned from server');
            }
        } catch (err) {
            console.error("Login failed:", err);
            setError(err.response?.data?.message || 'Login failed'); // Display error message

            // If email is not verified, navigate to the verification page
            if (err.response?.data?.message.includes("verify your email")) {
                // Navigate to the verification page and pass the email in the state
                navigate('/verify', { state: { email } });
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Sign in to Shopzy</h2>
                {error && <div className="error-message">{error}</div>}
                {message && <div className="message">{message}</div>}
                <form onSubmit={handleLogin} className="login-form">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="login-button">Login</button>
                    <p className="login-footer">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                        <br />
                        Forgot your password? <Link to="/forgot">Reset it</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
