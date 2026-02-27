import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { resetPasswordApi } from '../api';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) setError('Invalid reset link. Please request a new one.');
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!password || !confirmPassword) { setError('Please fill in both fields'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (password !== confirmPassword) { setError('Passwords do not match'); return; }

        try {
            setLoading(true);
            const data = await resetPasswordApi(token, password);
            // Store token so the app recognises the user on reload
            localStorage.setItem('projexis_token', data.token);
            localStorage.setItem('projexis_user', JSON.stringify(data.user));
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.message || 'Reset failed. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-glow" />
            <div className="glass-card login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <span className="login-logo-letter">P</span>
                    </div>
                    <h1 className="gradient-text login-title">Reset Password</h1>
                    <p className="text-secondary">
                        {success ? 'Password updated!' : 'Choose a new password for your account'}
                    </p>
                </div>

                {!token ? (
                    /* Invalid link */
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <AlertTriangle size={48} style={{ color: 'var(--color-priority-high)', margin: '0 auto 1rem' }} />
                        <p className="form-error" style={{ marginBottom: '1.5rem' }}>{error}</p>
                        <Link to="/forgot-password" className="btn btn-primary">
                            Request New Link
                        </Link>
                    </div>
                ) : success ? (
                    /* Success */
                    <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                        <CheckCircle size={56} style={{ color: 'var(--color-status-completed)', margin: '0 auto 1rem' }} />
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                            Your password has been reset successfully!
                        </p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                            Redirecting you to the dashboard...
                        </p>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <div className="form-input-wrapper">
                                <Lock size={18} className="form-input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    className="form-input-icon-both"
                                    disabled={loading}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="form-input-icon-right"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <div className="form-input-wrapper">
                                <Lock size={18} className="form-input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat your new password"
                                    className="form-input-icon-left"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {error && <div className="form-error">{error}</div>}

                        <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                            {loading ? (
                                <><span className="login-spinner" /> Resetting...</>
                            ) : (
                                <><Lock size={18} /> Set New Password</>
                            )}
                        </button>
                    </form>
                )}

                <div className="login-footer">
                    <Link to="/login" className="form-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <ArrowLeft size={16} />
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
