import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import { useApp } from '../context/AppContext';
import {
    Mail, Phone, Calendar, Briefcase, Edit2, Camera, LogOut,
    Award, Shield, Lock, Activity, TrendingUp, Clock, CheckCircle2,
    AlertCircle, Key, Smartphone, Globe
} from 'lucide-react';

const Profile = () => {
    const { id } = useParams(); // Could be a member ID
    const { sidebarCollapsed, currentUser, projects, teamMembers, logout, updateUserProfile } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Determine if we are viewing our own profile or someone else's
    const isOwnProfile = !id || id === currentUser?.id;

    // Find the target user's data
    const targetUser = isOwnProfile
        ? currentUser
        : teamMembers.find(m => String(m.id) === String(id) || String(m._id) === String(id) || String(m.linkedUser) === String(id)) || null;

    const [avatar, setAvatar] = useState(targetUser?.avatar || 'https://i.pravatar.cc/150?img=33');
    const fileInputRef = useRef(null);

    const [profileData, setProfileData] = useState({
        name: targetUser?.name || '',
        email: targetUser?.email || '',
        phone: targetUser?.phone || '',
        role: targetUser?.role || '',
        department: '',
        location: '',
        bio: '',
        joinDate: targetUser?.createdAt || new Date().toISOString(),
        status: targetUser?.status || 'active'
    });

    // Keep avatar and data in sync with targetUser 
    useEffect(() => {
        if (targetUser?.avatar) setAvatar(targetUser.avatar);
        setProfileData(prev => ({
            ...prev,
            name: targetUser?.name || prev.name,
            email: targetUser?.email || prev.email,
            phone: targetUser?.phone || prev.phone,
            role: targetUser?.role || prev.role,
            joinDate: targetUser?.createdAt || prev.joinDate,
            status: targetUser?.status || prev.status
        }));
    }, [targetUser, id]);

    // Calculate user stats & projects
    // If own profile, show all our projects. If viewing another, show projects where they are assigned.
    const userProjectsList = isOwnProfile
        ? projects
        : projects.filter(p => (p.assignedTeam || []).some(m => String(m.id || m._id || m) === String(targetUser?.id) || String(m.id || m._id || m) === String(targetUser?.linkedUser)));

    const userProjects = userProjectsList.length;
    const activeProjects = userProjectsList.filter(p => !['Completed', 'On Hold'].includes(p.status)).length;
    const completedProjects = userProjectsList.filter(p => p.status === 'Completed').length;

    // Real activity from user's projects
    const recentActivities = userProjectsList.slice(0, 5).map((p, i) => ({
        id: p.id || i,
        type: 'project',
        action: p.status === 'Completed' ? 'Completed project' : 'Active project',
        detail: p.name,
        time: p.endDate ? `Due ${new Date(p.endDate).toLocaleDateString()}` : p.status,
        icon: p.status === 'Completed' ? CheckCircle2 : Clock,
        color: p.status === 'Completed' ? 'var(--color-status-completed)' : 'var(--color-status-progress)'
    }));

    // Achievements based on real data
    // Achievements based on real data
    const projectCount = userProjectsList.length;
    const completedCount = completedProjects;
    const achievements = [
        { id: 1, name: 'Project Master', description: `Created ${projectCount} project(s)`, icon: Award, earned: projectCount >= 1, progress: Math.min(projectCount * 10, 100) },
        { id: 2, name: 'Team Player', description: `Collaborating with ${teamMembers?.length ?? 0} member(s)`, icon: Activity, earned: (teamMembers?.length ?? 0) >= 1, progress: Math.min((teamMembers?.length ?? 0) * 5, 100) },
        { id: 3, name: 'Finisher', description: `${completedCount} project(s) completed`, icon: CheckCircle2, earned: completedCount >= 1, progress: projectCount ? Math.min((completedCount / projectCount) * 100, 100) : 0 }
    ];

    const recentProjects = userProjectsList.slice(0, 3);

    // Placeholder skills (not stored in backend yet)
    const skills = [
        { name: 'Project Management', level: Math.min(100, 50 + projectCount * 5) },
        { name: 'Collaboration', level: Math.min(100, 40 + (teamMembers?.length ?? 0) * 10) }
    ];

    // Real team stats
    const teamStats = [
        { label: 'Team Members', value: String(teamMembers?.length ?? 0), icon: Activity, color: 'var(--color-electric-blue)' },
        { label: 'Your Projects', value: String(projects.length), icon: Briefcase, color: 'var(--color-electric-violet)' },
        { label: 'Completed', value: String(completedProjects), icon: CheckCircle2, color: 'var(--color-status-progress)' }
    ];

    const handleSave = async () => {
        setSaveLoading(true);
        setSaveError('');
        try {
            await updateUserProfile({
                name: profileData.name,
                role: profileData.role,
                avatar
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            setIsEditing(false);
        } catch (err) {
            setSaveError(err.message || 'Failed to save. Please try again.');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const dataUrl = reader.result;
                setAvatar(dataUrl);
                try {
                    await updateUserProfile({ avatar: dataUrl });
                } catch (err) {
                    console.error('Failed to save avatar:', err.message);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isOwnProfile && !targetUser) {
        return (
            <div className="main-layout">
                <Sidebar />
                <div className={`main-content ${sidebarCollapsed ? 'main-content-collapsed' : 'main-content-expanded'}`}>
                    <TopNav />
                    <div className="page-container flex items-center justify-center min-h-[50vh]">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
                            <p className="text-secondary mb-6">The team member you're looking for doesn't exist.</p>
                            <button className="btn btn-primary" onClick={() => navigate('/team')}>Go to Team</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-layout">
            <Sidebar />
            <div className={`main-content ${sidebarCollapsed ? 'main-content-collapsed' : 'main-content-expanded'}`}>
                <TopNav />
                <div className="page-container">
                    {/* Header */}
                    <div className="page-header">
                        <h1 className="text-3xl font-bold gradient-text">{isOwnProfile ? 'Profile' : `${targetUser.name}'s Profile`}</h1>
                        <p className="text-secondary page-subtitle">
                            {isOwnProfile ? 'Manage your personal information and preferences' : 'View team member details and workload'}
                        </p>
                    </div>

                    <div className="profile-layout">
                        {/* Left Column */}
                        <div className="profile-left-col">
                            {/* Profile Card */}
                            <div className="glass-card profile-card">
                                {/* Avatar Section */}
                                <div className="profile-avatar-section">
                                    <div className="profile-avatar-wrapper">
                                        <img src={avatar} alt="Profile" className="profile-avatar-img" />
                                        {isOwnProfile && (
                                            <>
                                                <button
                                                    className="btn btn-primary profile-avatar-btn"
                                                    onClick={handleAvatarClick}
                                                >
                                                    <Camera size={20} />
                                                </button>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    style={{ display: 'none' }}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-bold profile-name">{profileData.name}</h2>
                                    <p className="text-secondary">{profileData.role}</p>
                                </div>

                                {/* Stats */}
                                <div className="profile-stats">
                                    <div className="profile-stat-row">
                                        <span className="text-sm text-secondary">Total Projects</span>
                                        <span className="text-xl font-bold gradient-text">{userProjects}</span>
                                    </div>
                                    <div className="profile-stat-row">
                                        <span className="text-sm text-secondary">Active</span>
                                        <span className="text-xl font-bold" style={{ color: 'var(--color-status-progress)' }}>
                                            {activeProjects}
                                        </span>
                                    </div>
                                    <div className="profile-stat-row">
                                        <span className="text-sm text-secondary">Completed</span>
                                        <span className="text-xl font-bold" style={{ color: 'var(--color-status-completed)' }}>
                                            {completedProjects}
                                        </span>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                {isOwnProfile && (
                                    <button className="btn btn-secondary profile-logout-btn" onClick={handleLogout}>
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="glass-card quick-actions-card">
                                <h3 className="text-sm font-bold quick-actions-title">Quick Actions</h3>
                                <div className="quick-actions-list">
                                    <button className="btn btn-secondary quick-action-btn" onClick={() => navigate('/projects')}>
                                        <Briefcase size={16} />
                                        View All Projects
                                    </button>
                                    <button className="btn btn-secondary quick-action-btn" onClick={() => navigate('/team')}>
                                        <Activity size={16} />
                                        Manage Team
                                    </button>
                                    <button className="btn btn-secondary quick-action-btn" onClick={() => navigate('/settings')}>
                                        <Shield size={16} />
                                        Settings
                                    </button>
                                </div>
                            </div>

                            {/* Work Preferences */}
                            <div className="glass-card work-prefs-card">
                                <h3 className="text-sm font-bold work-prefs-title">Work Preferences</h3>
                                <div className="work-prefs-list">
                                    <div className="work-pref-item">
                                        <Clock size={14} style={{ color: 'var(--color-electric-blue)' }} />
                                        <div>
                                            <p className="text-xs font-semibold">Timezone</p>
                                            <p className="text-xs text-secondary">PST (UTC-8)</p>
                                        </div>
                                    </div>
                                    <div className="work-pref-item">
                                        <Calendar size={14} style={{ color: 'var(--color-electric-violet)' }} />
                                        <div>
                                            <p className="text-xs font-semibold">Work Hours</p>
                                            <p className="text-xs text-secondary">9 AM - 6 PM</p>
                                        </div>
                                    </div>
                                    <div className="work-pref-item">
                                        <Globe size={14} style={{ color: 'var(--color-status-completed)' }} />
                                        <div>
                                            <p className="text-xs font-semibold">Language</p>
                                            <p className="text-xs text-secondary">English (US)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="profile-right-col">
                            {/* Top Row: Personal Info + Activity */}
                            <div className="profile-top-row">
                                {/* Personal Information */}
                                <div className="glass-card personal-info-card">
                                    <div className="personal-info-header">
                                        <h3 className="text-xl font-bold">Personal Information</h3>
                                        {isOwnProfile && (
                                            !isEditing ? (
                                                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                                                    <Edit2 size={16} />
                                                    Edit Profile
                                                </button>
                                            ) : (
                                                <div className="form-actions personal-info-edit-btns">
                                                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={saveLoading}>Cancel</button>
                                                    <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saveLoading}>
                                                        {saveLoading ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* Profile Form */}
                                    <div className="profile-form-grid">
                                        {/* Full Name */}
                                        <div>
                                            <label className="text-sm font-semibold profile-form-label">Full Name</label>
                                            {isEditing ? (
                                                <input type="text" name="name" value={profileData.name} onChange={handleChange} className="form-input" />
                                            ) : (
                                                <p className="text-secondary">{profileData.name}</p>
                                            )}
                                        </div>

                                        {/* Email (read-only — not editable via profile) */}
                                        <div>
                                            <label className="text-sm font-semibold flex items-center gap-sm profile-form-label">
                                                <Mail size={16} style={{ color: 'var(--color-electric-blue)' }} />
                                                Email Address
                                            </label>
                                            <p className="text-secondary">{profileData.email}</p>
                                            {isEditing && isOwnProfile && (
                                                <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>Email cannot be changed here.</p>
                                            )}
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="text-sm font-semibold flex items-center gap-sm profile-form-label">
                                                <Phone size={16} style={{ color: 'var(--color-electric-violet)' }} />
                                                Phone Number
                                            </label>
                                            {isEditing ? (
                                                <input type="tel" name="phone" value={profileData.phone} onChange={handleChange} className="form-input" />
                                            ) : (
                                                <p className="text-secondary">{profileData.phone}</p>
                                            )}
                                        </div>

                                        {/* Role */}
                                        <div>
                                            <label className="text-sm font-semibold flex items-center gap-sm profile-form-label">
                                                <Briefcase size={16} style={{ color: 'var(--color-status-progress)' }} />
                                                Role
                                            </label>
                                            {isEditing ? (
                                                <input type="text" name="role" value={profileData.role} onChange={handleChange} className="form-input" />
                                            ) : (
                                                <p className="text-secondary">{profileData.role}</p>
                                            )}
                                        </div>

                                        {/* Department */}
                                        <div>
                                            <label className="text-sm font-semibold profile-form-label">Department</label>
                                            {isEditing ? (
                                                <input type="text" name="department" value={profileData.department} onChange={handleChange} className="form-input" />
                                            ) : (
                                                <p className="text-secondary">{profileData.department}</p>
                                            )}
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <label className="text-sm font-semibold flex items-center gap-sm profile-form-label">
                                                <Globe size={16} style={{ color: 'var(--color-status-completed)' }} />
                                                Location
                                            </label>
                                            {isEditing ? (
                                                <input type="text" name="location" value={profileData.location} onChange={handleChange} className="form-input" />
                                            ) : (
                                                <p className="text-secondary">{profileData.location}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div className="profile-form-fullwidth">
                                        <label className="text-sm font-semibold profile-form-label">Bio</label>
                                        {isEditing ? (
                                            <textarea
                                                name="bio"
                                                value={profileData.bio}
                                                onChange={handleChange}
                                                rows={3}
                                                className="form-input"
                                                style={{ resize: 'vertical' }}
                                            />
                                        ) : (
                                            <p className="text-secondary">{profileData.bio}</p>
                                        )}
                                    </div>

                                    {/* Save status */}
                                    {saveError && (
                                        <div className="profile-form-fullwidth" style={{ color: 'var(--color-priority-critical)', fontSize: '0.85rem' }}>
                                            ⚠ {saveError}
                                        </div>
                                    )}
                                    {saveSuccess && (
                                        <div className="profile-form-fullwidth" style={{ color: 'var(--color-status-completed)', fontSize: '0.85rem' }}>
                                            ✓ Profile saved successfully!
                                        </div>
                                    )}

                                    {/* Join Date */}
                                    <div className="profile-form-fullwidth">
                                        <label className="text-sm font-semibold flex items-center gap-sm profile-form-label">
                                            <Calendar size={16} style={{ color: 'var(--color-status-completed)' }} />
                                            Member Since
                                        </label>
                                        <p className="text-secondary">
                                            {profileData.joinDate
                                                ? (() => {
                                                    const d = new Date(profileData.joinDate);
                                                    return isNaN(d.getTime())
                                                        ? '—'
                                                        : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                                                })()
                                                : '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="glass-card activity-card">
                                    <div className="activity-card-header">
                                        <Activity size={20} style={{ color: 'var(--color-electric-blue)' }} />
                                        <h3 className="text-lg font-bold">{isOwnProfile ? 'Your Projects' : `${targetUser.name}'s Projects`}</h3>
                                    </div>
                                    <div className="activity-list">
                                        {recentActivities.length === 0 ? (
                                            <p className="text-secondary text-sm">No projects yet. Create one from the Dashboard.</p>
                                        ) : recentActivities.map((activity, index) => (
                                            <div key={activity.id} className="activity-item">
                                                {/* Timeline connector */}
                                                {index < recentActivities.length - 1 && (
                                                    <div className="activity-connector" />
                                                )}
                                                {/* Icon */}
                                                <div
                                                    className="activity-icon"
                                                    style={{ border: `2px solid ${activity.color}` }}
                                                >
                                                    <activity.icon size={12} style={{ color: activity.color }} />
                                                </div>
                                                {/* Content */}
                                                <div>
                                                    <p className="text-sm font-semibold">{activity.action}</p>
                                                    <p className="text-xs" style={{ color: activity.color }}>{activity.detail}</p>
                                                    <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Recent Projects + Skills (simplified layout) */}
                            <div className="profile-bottom-row">
                                {/* Recent Projects */}
                                <div className="glass-card recent-projects-card">
                                    <div className="recent-projects-card-header">
                                        <Briefcase size={20} style={{ color: 'var(--color-status-progress)' }} />
                                        <h3 className="text-lg font-bold">Recent Projects</h3>
                                    </div>
                                    <div className="recent-projects-list">
                                        {recentProjects.length === 0 ? (
                                            <p className="text-secondary text-sm">No projects yet. Create one from the Dashboard.</p>
                                        ) : recentProjects.map(project => (
                                            <div
                                                key={project.id}
                                                className="recent-project-card-item"
                                                onClick={() => navigate(`/project/${project.id}`)}
                                            >
                                                <div className="recent-project-card-top">
                                                    <p className="text-xs font-semibold">{project.name}</p>
                                                    <span className={`badge badge-priority-${project.priority.toLowerCase()}`} style={{ fontSize: '0.6rem', marginTop: '0.25rem' }}>
                                                        {project.priority}
                                                    </span>
                                                </div>
                                                <div className="recent-project-progress-row">
                                                    <div className="progress-bar" style={{ flex: 1, height: '3px' }}>
                                                        <div className="progress-fill" style={{ width: `${project.progress}%` }} />
                                                    </div>
                                                    <span className="text-xs font-bold">{project.progress}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Skills & Team snapshot */}
                                <div className="profile-skills-row">
                                    <div className="glass-card skills-card">
                                        <div className="skills-card-header">
                                            <TrendingUp size={20} style={{ color: 'var(--color-status-progress)' }} />
                                            <h3 className="text-lg font-bold">Skills &amp; Collaboration</h3>
                                        </div>
                                        <div className="skills-grid">
                                            {skills.map((skill, index) => (
                                                <div key={index}>
                                                    <div className="skill-item-header">
                                                        <span className="text-sm font-semibold">{skill.name}</span>
                                                        <span className="text-sm font-bold gradient-text">{skill.level}%</span>
                                                    </div>
                                                    <div className="progress-bar" style={{ height: '6px' }}>
                                                        <div
                                                            className="progress-fill"
                                                            style={{
                                                                width: `${skill.level}%`,
                                                                background: 'linear-gradient(90deg, var(--color-electric-blue), var(--color-electric-violet))'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
