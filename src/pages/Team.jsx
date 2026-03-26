import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import { useApp } from '../context/AppContext';
import TeamMemberModal from '../components/TeamMemberModal';
import MemberProjectsModal from '../components/MemberProjectsModal';
import { Mail, Phone, Briefcase, Plus, Edit2, Trash2, CheckCircle, AlertTriangle, MessageSquare, User } from 'lucide-react';

const Team = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed, projects, teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, openChat } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null); // Just the ID of the member to delete
    const [toast, setToast] = useState(null); // { type: 'success'|'warning', message: string }

    // Auto-dismiss toast after 5 seconds
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(t);
    }, [toast]);

    const getTeamMemberWorkload = (memberId) => {
        return projects.filter(p =>
            (p.assignedTeam || []).some(entry => {
                const entryId = entry && typeof entry === 'object'
                    ? String(entry.id || entry._id)
                    : String(entry);
                return entryId === String(memberId);
            })
        ).length;
    };

    const getMemberProjects = (memberId) => {
        return projects.filter(p =>
            (p.assignedTeam || []).some(entry => {
                const entryId = entry && typeof entry === 'object'
                    ? String(entry.id || entry._id)
                    : String(entry);
                return entryId === String(memberId);
            })
        );
    };

    const handleAddMember = () => {
        setEditingMember(null);
        setShowModal(true);
    };

    const handleEditMember = (member) => {
        setEditingMember(member);
        setShowModal(true);
    };

    const handleDeleteMember = async (member) => {
        console.log("Team.jsx: Initiating deletion for member:", member.id);
        setConfirmDelete(member);
    };

    const confirmDeleteMember = async () => {
        if (!confirmDelete) return;
        const member = confirmDelete;
        try {
            console.log("Team.jsx: Confirming deletion for:", member.id);
            await deleteTeamMember(member.id);
            setToast({ type: 'success', message: `${member.name} removed from the team.` });
        } catch (err) {
            console.error("Team.jsx: Deletion error:", err);
            setToast({ type: 'warning', message: `Could not remove member: ${err.message}` });
        } finally {
            setConfirmDelete(null);
        }
    };

    const handleSaveMember = async (memberData) => {
        if (editingMember) {
            await updateTeamMember(editingMember.id, memberData);
            setToast({ type: 'success', message: `${memberData.name}'s details updated.` });
        } else {
            try {
                const result = await addTeamMember(memberData);
                if (result?.emailSent) {
                    setToast({ type: 'success', message: `✅ Invitation email sent to ${memberData.email}!` });
                } else {
                    setToast({ type: 'warning', message: `Member added, but the invitation email could not be sent. Check your email settings in the backend .env file.` });
                }
            } catch (err) {
                setToast({ type: 'warning', message: `Failed to add member: ${err.message}` });
            }
        }
        setShowModal(false);
        setEditingMember(null);
    };

    return (
        <div className="main-layout">
            <Sidebar />
            <div className={`main-content ${sidebarCollapsed ? 'main-content-collapsed' : 'main-content-expanded'}`}>
                <TopNav />
                <div className="page-container">

                    {/* Toast Notification */}
                    {toast && (
                        <div style={{
                            position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
                            display: 'flex', alignItems: 'center', gap: '12px',
                            background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}`,
                            color: toast.type === 'success' ? '#34d399' : '#fbbf24',
                            padding: '14px 20px', borderRadius: '12px',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            maxWidth: '420px', fontSize: '14px', lineHeight: '1.5'
                        }}>
                            {toast.type === 'success'
                                ? <CheckCircle size={20} style={{ flexShrink: 0 }} />
                                : <AlertTriangle size={20} style={{ flexShrink: 0 }} />}
                            <span>{toast.message}</span>
                            <button onClick={() => setToast(null)}
                                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: 'auto', fontSize: '18px', lineHeight: 1 }}
                            >×</button>
                        </div>
                    )}
                    {/* Header */}
                    <div className="page-header">
                        <div className="page-header-row">
                            <div>
                                <h1 className="text-3xl font-bold gradient-text">Team</h1>
                                <p className="text-secondary page-subtitle">
                                    Manage your team members and their workload
                                </p>
                            </div>
                            <button className="btn btn-primary" onClick={handleAddMember}>
                                <Plus size={20} />
                                Add Member
                            </button>
                        </div>
                    </div>

                    {/* Team Members Grid */}
                    <div className="team-grid">
                        {teamMembers.map(member => {
                            const workload = getTeamMemberWorkload(member.id);
                            const memberProjects = getMemberProjects(member.id);

                            return (
                                <div key={member.id} className="glass-card member-card">
                                    {/* Action Buttons */}
                                    <div className="member-card-actions">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const targetId = member.linkedUser?.id || member.linkedUser?._id || member.linkedUser || member._id || member.id;
                                                openChat(typeof targetId === 'object' ? String(targetId._id || targetId.id) : String(targetId));
                                            }}
                                            className="btn btn-secondary btn-icon-sm"
                                            title="Send message"
                                        >
                                            <MessageSquare size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const targetId = member.linkedUser?.id || member.linkedUser?._id || member.linkedUser || member._id || member.id;
                                                navigate(`/profile/${typeof targetId === 'object' ? String(targetId._id || targetId.id) : String(targetId)}`);
                                            }}
                                            className="btn btn-secondary btn-icon-sm"
                                            title="View profile"
                                        >
                                            <User size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleEditMember(member)}
                                            className="btn btn-secondary btn-icon-sm"
                                            title="Edit member"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteMember(member)}
                                            className="btn btn-ghost btn-icon-sm"
                                            style={{ color: 'var(--color-priority-critical)' }}
                                            title="Remove member"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Member Header */}
                                    <div className="member-card-header">
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="avatar"
                                            style={{ width: '64px', height: '64px' }}
                                        />
                                        <div className="member-card-info">
                                            <h3 className="font-bold text-lg">{member.name}</h3>
                                            <p className="text-sm text-secondary member-role">{member.role}</p>
                                            <div className={`member-status-badge member-status-badge--${member.status}`}>
                                                <div className={`status-dot status-dot--${member.status}`} />
                                                {member.status}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="member-contact-block">
                                        <div className="flex items-center gap-sm text-sm">
                                            <Mail size={16} style={{ color: 'var(--color-electric-blue)' }} />
                                            <span className="text-secondary">{member.email}</span>
                                        </div>
                                        {member.phone && (
                                            <div className="flex items-center gap-sm text-sm">
                                                <Phone size={16} style={{ color: 'var(--color-electric-violet)' }} />
                                                <span className="text-secondary">{member.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Workload */}
                                    <div className="member-workload">
                                        <div className="member-workload-header">
                                            <span className="text-sm font-semibold flex items-center gap-sm">
                                                <Briefcase size={16} />
                                                Active Projects
                                            </span>
                                            <span className="text-sm font-bold gradient-text">{workload}</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${Math.min((workload / 10) * 100, 100)}%`,
                                                    background: workload > 7 ? 'var(--color-priority-high)' :
                                                        workload > 4 ? 'var(--color-priority-medium)' :
                                                            'var(--color-status-completed)'
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Assigned Projects Panel */}
                                    {memberProjects.length > 0 && (
                                        <div
                                            className="member-projects-panel"
                                            onClick={() => setSelectedMember({ member, projects: memberProjects })}
                                        >
                                            <div className="member-projects-glow" />
                                            <div className="member-projects-content">
                                                <div className="member-projects-header">
                                                    <span className="member-projects-label">Active Projects</span>
                                                    <Briefcase size={16} style={{ color: 'var(--color-electric-violet)' }} />
                                                </div>
                                                <div className="text-center" style={{ padding: '0.5rem 0' }}>
                                                    <div className="member-projects-count">{memberProjects.length}</div>
                                                    <div className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>
                                                        Click to view details
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Team Member Modal */}
                    <TeamMemberModal
                        isOpen={showModal}
                        onClose={() => {
                            setShowModal(false);
                            setEditingMember(null);
                        }}
                        onSave={handleSaveMember}
                        member={editingMember}
                    />

                    {/* Member Projects Modal */}
                    <MemberProjectsModal
                        isOpen={!!selectedMember}
                        onClose={() => setSelectedMember(null)}
                        member={selectedMember?.member}
                        projects={selectedMember?.projects || []}
                    />

                    {/* Custom Deletion Confirmation Modal */}
                    {confirmDelete && (
                        <div className="modal-overlay" style={{ zIndex: 10001 }}>
                            <div className="glass-card modal-container animate-fade-in-up" style={{ maxWidth: '400px' }}>
                                <div className="modal-header">
                                    <h2 className="text-xl font-bold">Remove Member?</h2>
                                </div>
                                <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
                                    Are you sure you want to remove <strong>{confirmDelete.name}</strong> from the team? This action cannot be undone.
                                </p>
                                <div className="modal-actions">
                                    <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                                    <button className="btn btn-primary" style={{ background: 'var(--color-priority-critical)' }} onClick={confirmDeleteMember}>Remove</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Team;
