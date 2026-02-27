import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { acceptInvite } from '../api';
import { useApp } from '../context/AppContext';

const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { loginAfterInvite } = useApp();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            setError('Invalid invitation link. Please ask your admin to resend the invite.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            return setError('Passwords do not match');
        }
        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            const data = await acceptInvite(token, password);
            await loginAfterInvite(data);
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message || 'Something went wrong. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                {/* Header */}
                <div className="login-header">
                    <div className="login-logo">
                        <span className="login-logo-icon">⬡</span>
                        <span className="login-logo-text">Projexis</span>
                    </div>
                    <h1 className="login-title">Accept Your Invitation</h1>
                    <p className="login-subtitle">
                        {tokenValid
                            ? "Set a password to activate your account"
                            : "Invalid or expired invitation link"
                        }
                    </p>
                </div>

                {/* Error banner */}
                {error && (
                    <div className="login-error">
                        <span>⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                {tokenValid && (
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="At least 6 characters"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Repeat your password"
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >
                            {loading
                                ? <><span className="login-spinner" /> Activating Account...</>
                                : 'Activate My Account'
                            }
                        </button>
                    </form>
                )}

                {!tokenValid && (
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <p className="login-subtitle">
                            Contact your admin to receive a new invite link.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcceptInvite;
