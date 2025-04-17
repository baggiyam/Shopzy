import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../Styles/codeVerification.css";

const CodeVerificationPage = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5004/api/verification', { email, verificationCode });
            setSuccess(res.data.message);
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        }

    };

    const handleResendCode = async () => {
        setLoading(true);
        try {
            // Call the resend API
            const res = await axios.post('http://localhost:5004/api/resend', { email });
            setSuccess(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend verification code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verification-container">
            <div className="verification-card">
                <h2 className="verification-title">Enter Verification Code</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <form onSubmit={handleVerifyCode} className="verification-form">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Verification Code</label>
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                    />
                    <button type="submit" className="verify-button">Verify Code</button>
                </form>
                <p className="resend-footer">
                    Didn't receive the code?
                    <button onClick={handleResendCode} disabled={loading}>
                        {loading ? 'Resending...' : 'Resend Code'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default CodeVerificationPage;
