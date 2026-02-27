import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import { useApp } from '../context/AppContext';
import { User, Bell, Moon, Sun, Save, Lock, Eye, EyeOff } from 'lucide-react';
import { updatePasswordApi } from '../api';
const Settings = () => {
    const { sidebarCollapsed, currentUser, updateUserProfile, pushNotification } = useApp();
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        department: currentUser?.department || '',
        location: currentUser?.location || '',
        bio: currentUser?.bio || '',
        notifications: {
            email: true,
            push: true,
            taskUpdates: true,
            projectUpdates: true,
            mentions: true
        }
    });
    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState('');

    const [showPassword, setShowPassword] = useState(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (key) => {
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key]
            }
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaveError('');
        try {
            await updateUserProfile({
                name: formData.name,
                phone: formData.phone,
                department: formData.department,
                location: formData.location,
                bio: formData.bio
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setSaveError(err.message || 'Failed to save.');
            pushNotification({
                id: `err-${Date.now()}`,
                type: 'error',
                title: 'Could not save profile',
                message: err.message || 'Please try again.',
                read: false
            });
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess(false);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setPasswordError('New passwords do not match');
        }
        if (passwordData.newPassword.length < 6) {
            return setPasswordError('New password must be at least 6 characters');
        }

        try {
            await updatePasswordApi({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordSuccess(true);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch (err) {
            setPasswordError(err.message || 'Failed to update password');
        }
    };

    return (
        <div className="main-layout">
            <Sidebar />
            <div className={`main-content ${sidebarCollapsed ? 'main-content-collapsed' : 'main-content-expanded'}`}>
                <TopNav />
                <div className="page-container">
                    {/* Header */}
                    <div className="page-header">
                        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
                        <p className="text-secondary page-subtitle">
                            Manage your account and preferences
                        </p>
                    </div>

                    <div className="settings-layout">
                        <form onSubmit={handleSave}>
                            {/* Profile Settings */}
                            <div className="glass-card settings-section">
                                <h2 className="text-xl font-bold settings-section-title">
                                    <User size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Profile Settings
                                </h2>
                                <div className="settings-form-stack">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-input"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            readOnly
                                            disabled
                                            className="form-input"
                                            style={{ width: '100%', opacity: 0.9 }}
                                            title="Email cannot be changed"
                                        />
                                        <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>Email cannot be changed.</p>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="form-input"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Department</label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="form-input"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="form-input"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="form-label">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="form-input"
                                            style={{ width: '100%', resize: 'vertical', minHeight: '80px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="glass-card settings-section">
                                <h2 className="text-xl font-bold settings-section-title">
                                    <Bell size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Notification Preferences
                                </h2>
                                <div className="settings-form-stack">
                                    {[
                                        { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                                        { key: 'push', label: 'Push Notifications', desc: 'Receive browser push notifications' },
                                        { key: 'taskUpdates', label: 'Task Updates', desc: 'Get notified when tasks are updated' },
                                        { key: 'projectUpdates', label: 'Project Updates', desc: 'Get notified about project changes' },
                                        { key: 'mentions', label: 'Mentions', desc: 'Get notified when someone mentions you' }
                                    ].map(item => (
                                        <label key={item.key} className="notification-item">
                                            <div>
                                                <p className="font-semibold">{item.label}</p>
                                                <p className="text-xs text-secondary notification-item-desc">{item.desc}</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={formData.notifications[item.key]}
                                                onChange={() => handleNotificationChange(item.key)}
                                                className="notification-checkbox"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="form-actions" style={{ marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} />
                                    Save Changes
                                </button>
                                {saved && (
                                    <span className="text-sm save-success">
                                        ✓ Settings saved successfully!
                                    </span>
                                )}
                                {saveError && (
                                    <span className="text-sm" style={{ color: 'var(--color-priority-critical)' }}>
                                        {saveError}
                                    </span>
                                )}
                            </div>
                        </form>

                        {/* Password Settings */}
                        <form onSubmit={handlePasswordSubmit} style={{ marginTop: '2rem' }}>
                            <div className="glass-card settings-section">
                                <h2 className="text-xl font-bold settings-section-title">
                                    <Lock size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Change Password
                                </h2>
                                <div className="settings-form-stack">
                                    <div className="form-group" style={{ position: 'relative' }}>
                                        <label className="form-label">Current Password</label>
                                        <input
                                            type={showPassword === 'current' ? 'text' : 'password'}
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="form-input"
                                            style={{ width: '100%', paddingRight: '2.5rem' }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(p => p === 'current' ? null : 'current')}
                                            style={{
                                                position: 'absolute', right: '10px', top: '35px',
                                                background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer'
                                            }}
                                        >
                                            {showPassword === 'current' ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <div className="form-group" style={{ position: 'relative' }}>
                                        <label className="form-label">New Password</label>
                                        <input
                                            type={showPassword === 'new' ? 'text' : 'password'}
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="form-input"
                                            style={{ width: '100%', paddingRight: '2.5rem' }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(p => p === 'new' ? null : 'new')}
                                            style={{
                                                position: 'absolute', right: '10px', top: '35px',
                                                background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer'
                                            }}
                                        >
                                            {showPassword === 'new' ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <div className="form-group" style={{ position: 'relative' }}>
                                        <label className="form-label">Confirm New Password</label>
                                        <input
                                            type={showPassword === 'confirm' ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="form-input"
                                            style={{ width: '100%', paddingRight: '2.5rem' }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(p => p === 'confirm' ? null : 'confirm')}
                                            style={{
                                                position: 'absolute', right: '10px', top: '35px',
                                                background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer'
                                            }}
                                        >
                                            {showPassword === 'confirm' ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {passwordError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{passwordError}</p>}
                                    {passwordSuccess && <p className="text-sm" style={{ color: 'var(--color-success)' }}>✓ Password updated successfully!</p>}

                                    <div className="form-actions" style={{ marginTop: '1rem' }}>
                                        <button type="submit" className="btn btn-primary">
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
