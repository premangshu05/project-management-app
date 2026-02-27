import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Background Gradient Effect */}
            <div className="login-glow" />

            {/* Login Card */}
            <div className="glass-card login-card">
                {/* Logo & Header */}
                <div className="login-header">
                    <div className="login-logo">
                        <span className="login-logo-letter">P</span>
                    </div>
                    <h1 className="gradient-text login-title">Welcome to Projexis</h1>
                    <p className="text-secondary">Sign in to manage your projects</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Email Field */}
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
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="form-input-wrapper">
                            <Lock size={18} className="form-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="form-input-icon-both"
                                disabled={loading}
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

                    {/* Error Message */}
                    {error && <div className="form-error">{error}</div>}

                    {/* Remember Me & Forgot Password */}
                    <div className="form-row">
                        <label className="form-checkbox-label">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span className="text-sm text-secondary">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-sm form-link">Forgot password?</Link>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="login-spinner" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div className="login-footer">
                    <p className="text-secondary text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="form-link">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
