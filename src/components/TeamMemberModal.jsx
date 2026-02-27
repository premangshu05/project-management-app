import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

const TeamMemberModal = ({ isOpen, onClose, onSave, member = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Developer',
        phone: '',
        status: 'pending',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
    });

    // Update form data when member changes (backend status: pending | active)
    useEffect(() => {
        if (member) {
            setFormData({
                name: member.name || '',
                email: member.email || '',
                role: member.role || 'Developer',
                phone: member.phone || '',
                status: member.status === 'active' || member.status === 'pending' ? member.status : 'active',
                avatar: member.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
            });
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'Developer',
                phone: '',
                status: 'pending',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
            });
        }
    }, [member, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const generateRandomAvatar = () => {
        const seed = Math.random().toString(36).substring(7);
        setFormData(prev => ({
            ...prev,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass-card modal-container" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="modal-header">
                    <h2 className="text-2xl font-bold gradient-text">
                        {member ? 'Edit Team Member' : 'Add Team Member'}
                    </h2>
                    <button onClick={onClose} className="btn btn-ghost modal-close-btn">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Avatar Section */}
                    <div className="avatar-section">
                        <img
                            src={formData.avatar}
                            alt="Avatar"
                            className="avatar-preview"
                        />
                        <div className="avatar-controls">
                            <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                                <Upload size={16} />
                                Upload Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            <button
                                type="button"
                                onClick={generateRandomAvatar}
                                className="btn btn-ghost"
                            >
                                Random Avatar
                            </button>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="form-stack">
                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Role *</label>
                            <input
                                name="role"
                                list="role-options"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Select or type a role"
                                style={{ background: 'var(--color-bg-secondary)' }}
                            />
                            <datalist id="role-options">
                                <option value="Developer" />
                                <option value="Designer" />
                                <option value="Project Manager" />
                                <option value="QA Engineer" />
                                <option value="DevOps Engineer" />
                                <option value="Product Manager" />
                                <option value="UI/UX Designer" />
                                <option value="Full Stack Developer" />
                                <option value="Backend Developer" />
                                <option value="Frontend Developer" />
                            </datalist>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                value={formData.status === 'active' || formData.status === 'pending' ? formData.status : 'active'}
                                onChange={handleChange}
                                className="form-input"
                                style={{ background: 'var(--color-bg-secondary)' }}
                            >
                                <option value="pending">Pending invite</option>
                                <option value="active">Active</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {member ? 'Update' : 'Add'} Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeamMemberModal;
