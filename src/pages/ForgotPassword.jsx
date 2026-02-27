import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { forgotPasswordApi } from '../api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email) { setError('Please enter your email address'); return; }

        try {
            setLoading(true);
            await forgotPasswordApi(email);
            setSent(true);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-glow" />
            <div className="glass-card login-card">
                {/* Logo */}
                <div className="login-header">
                    <div className="login-logo">
                        <span className="login-logo-letter">P</span>
                    </div>
                    <h1 className="gradient-text login-title">Forgot Password</h1>
                    <p className="text-secondary">
                        {sent ? "Check your inbox" : "Enter your email and we'll send you a reset link"}
                    </p>
                </div>

                {sent ? (
                    /* Success State */
                    <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                        <CheckCircle
                            size={56}
                            style={{ color: 'var(--color-status-completed)', margin: '0 auto 1rem' }}
                        />
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            If <strong style={{ color: 'var(--color-text-primary)' }}>{email}</strong> is linked to an account,
                            you'll receive a password reset link shortly.<br /><br />
                            The link expires in <strong style={{ color: 'var(--color-electric-violet)' }}>1 hour</strong>.
                        </p>
                        <button
                            onClick={() => { setSent(false); setEmail(''); }}
                            className="btn btn-ghost"
                            style={{ marginBottom: '1rem' }}
                        >
                            Send another link
                        </button>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="form-input-wrapper">
                                <Mail size={18} className="form-input-icon" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="form-input-icon-left"
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && <div className="form-error">{error}</div>}

                        <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                            {loading ? (
                                <><span className="login-spinner" /> Sending...</>
                            ) : (
                                <><Send size={18} /> Send Reset Link</>
                            )}
                        </button>
                    </form>
                )}

                {/* Back to Login */}
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

export default ForgotPassword;
