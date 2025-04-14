import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "../Styles/login.css";

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {

            const res = await axios.post('http://localhost:5004/api/signup', { username, email, password });

            setSuccess(res.data.message);
            setError('');

            // Navigate to the verification page with the email passed in the state
            setTimeout(() => {
                navigate('/verify', { state: { email } });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
            setSuccess('');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Create an Account</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <form onSubmit={handleSignup} className="login-form">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
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
                    <button type="submit" className="login-button">Sign Up</button>
                    <p className="login-footer">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
