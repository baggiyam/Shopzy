import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "../Styles/login.css";

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5004/api/resetpassword", {
                email,
                resetcode: resetCode,
                newPassword
            });
            setMessage(res.data.message);
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Reset Your Password</h2>
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleReset} className="login-form">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Reset Code</label>
                    <input
                        type="text"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        required
                    />
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                    <p className="login-footer">
                        Back to <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
