import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import { acceptInvite } from '../api';
import { useApp } from '../context/AppContext';

const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { loginAfterInvite } = useApp();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
            <div className="login-glow" />
            <div className="glass-card login-card">
                {/* Header */}
                <div className="login-header">
                    <div className="login-logo">
                        <img src="/favicon.png" alt="P" className="login-logo-image" />
                    </div>
                    <h1 className="gradient-text login-title">Accept Invitation</h1>
                    <p className="text-secondary">
                        {tokenValid
                            ? "Set a password to join your team"
                            : "Invalid or expired invitation link"
                        }
                    </p>
                </div>

                {error && <div className="form-error">{error}</div>}

                {/* Form */}
                {tokenValid && (
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Create Password</label>
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
                            <label className="form-label">Confirm Password</label>
                            <div className="form-input-wrapper">
                                <Lock size={18} className="form-input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="Repeat your password"
                                    className="form-input-icon-left"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary login-submit"
                            disabled={loading}
                        >
                            {loading
                                ? <><span className="login-spinner" /> Activating...</>
                                : <><CheckCircle size={18} /> Activate Account</>
                            }
                        </button>
                    </form>
                )}

                {!tokenValid && (
                    <div className="login-footer">
                        <Link to="/login" className="form-link">
                            <ArrowLeft size={16} /> Back to Sign In
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcceptInvite;
