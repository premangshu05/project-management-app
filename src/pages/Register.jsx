import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserPlus, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-glow" />

            <div className="glass-card login-card">
                {/* Header */}
                <div className="login-header">
                    <div className="login-logo">
                        <span className="login-logo-letter">P</span>
                    </div>
                    <h1 className="gradient-text login-title">Create Account</h1>
                    <p className="text-secondary">Join Projexis and manage your projects</p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Name */}
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div className="form-input-wrapper">
                            <User size={18} className="form-input-icon" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                className="form-input-icon-left"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Email */}
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

                    {/* Password */}
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="form-input-wrapper">
                            <Lock size={18} className="form-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 6 characters"
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

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <div className="form-input-wrapper">
                            <Lock size={18} className="form-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat your password"
                                className="form-input-icon-left"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && <div className="form-error">{error}</div>}

                    {/* Submit */}
                    <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="login-spinner" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                <UserPlus size={20} />
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                {/* Sign In Link */}
                <div className="login-footer">
                    <p className="text-secondary text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="form-link">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
