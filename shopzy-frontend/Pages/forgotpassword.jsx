import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../Styles/login.css";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // Step 1: Email, Step 2: Code Verification

    const handleSendResetCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await axios.post('http://localhost:5004/api/forgotpassword', { email });
            setMessage(res.data.message);
            setStep(2); // Go to code verification step
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await axios.post('http://localhost:5004/api/resetpassword', {
                email,
                resetcode: resetCode,
                newPassword
            });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Forgot Your Password?</h2>
                <p className="login-subtitle">Enter your email and we’ll send you a reset code.</p>

                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendResetCode} className="login-form">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Code'}
                        </button>
                        <p className="login-footer">
                            Remembered your password? <Link to="/login">Back to Login</Link>
                        </p>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="login-form">
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
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify and Reset Password'}
                        </button>
                        <p className="login-footer">
                            Remembered your password? <Link to="/login">Back to Login</Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
