import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import ProjectModal from '../components/ProjectModal';
import { Calendar, Flag, Users, ArrowLeft, Edit, Trash2, CheckCircle2, Circle, MessageSquare, User, X } from 'lucide-react';
import { formatDate } from '../utils/dateHelpers';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects, teamMembers, sidebarCollapsed, toggleSubtask, deleteProject, updateProject, openChat, currentUser, pushNotification } = useApp();
    const [showEditModal, setShowEditModal] = useState(false);
    const [popupState, setPopupState] = useState(null); // { member, top, left }
    const popupRef = useRef(null);

    // Close popup when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (popupState && popupRef.current && !popupRef.current.contains(e.target)) {
                setPopupState(null);
            }
        };
        // Use timeout to prevent instant close from the same click that opened it
        const timer = setTimeout(() => {
            document.addEventListener('click', handler);
        }, 10);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', handler);
        };
    }, [popupState]);

    const project = projects.find(p => String(p.id) === String(id));

    if (!project) {
        return (
            <div className="main-layout">
                <Sidebar />
                <div className={`main-content ${sidebarCollapsed ? 'main-content-collapsed' : 'main-content-expanded'}`}>
                    <TopNav />
                    <div className="page-container">
                        <h1 className="text-3xl font-bold">Project Not Found</h1>
                        <button onClick={() => navigate('/')} className="btn btn-secondary btn-back">
                            <ArrowLeft size={20} />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete "${project.name}"?`)) return;
        try {
            await deleteProject(project.id);
            navigate('/');
        } catch (err) {
            pushNotification({
                id: `err-${Date.now()}`,
                type: 'error',
                title: 'Could not delete project',
                message: err.message || 'Please try again.',
                read: false
            });
        }
    };

    // assignedTeam comes from the API as populated objects OR as string IDs
    const teamMemberDetails = (project.assignedTeam || []).map(entry => {
        // If it's a populated object from the backend, use it directly
        if (entry && typeof entry === 'object' && entry.name) {
            return {
                id: entry.id || entry._id,
                name: entry.name,
                avatar: entry.avatar || `https://i.pravatar.cc/150?u=${entry.email || entry._id}`,
                status: entry.status || 'pending'
            };
        }
        // If it's a raw ID string, look it up in the context teamMembers
        const found = teamMembers.find(m => String(m.id) === String(entry) || String(m._id) === String(entry));
        return found
            ? { id: found.id, name: found.name, avatar: found.avatar, linkedUser: found.linkedUser, role: found.role, email: found.email, status: found.status }
            : { id: String(entry), name: 'Team Member', avatar: `https://i.pravatar.cc/150?u=${entry}`, status: 'pending' };
    });

    return (
        <div className="main-layout">
            <Sidebar />
            <div className={`main-content ${sidebarCollapsed ? 'main-content-collapsed' : 'main-content-expanded'}`}>
                <TopNav />
                <div className="page-container">
                    {/* Back Button */}
                    <button onClick={() => navigate('/')} className="btn btn-secondary btn-back">
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </button>

                    {/* Project Header */}
                    <div className="glass-card project-header-card animate-fade-in-up">
                        <div className="project-header-top">
                            <div className="project-header-info">
                                <h1 className="text-4xl font-extrabold gradient-text project-header-title" style={{ letterSpacing: '-0.02em' }}>
                                    {project.name}
                                </h1>
                                <p className="text-secondary project-header-desc" style={{ fontSize: 'var(--font-size-lg)', maxWidth: '800px' }}>
                                    {project.description}
                                </p>
                                <div className="project-badges">
                                    <span className={`badge badge-priority-${project.priority.toLowerCase()}`}>
                                        <Flag size={12} />
                                        {project.priority}
                                    </span>
                                    <span className="badge badge-category">
                                        {project.category}
                                    </span>
                                    <span className={`badge badge-status-${project.status.toLowerCase().replace(/\s+/g, '')}`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="project-header-actions">
                                <button className="btn btn-primary" onClick={() => setShowEditModal(true)}>
                                    <Edit size={18} />
                                    Edit
                                </button>
                                <button onClick={handleDelete} className="btn btn-danger">
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Project Meta Info */}
                        <div className="project-meta-grid">
                            <div>
                                <p className="text-xs text-secondary project-meta-label">Start Date</p>
                                <div className="flex items-center gap-sm">
                                    <Calendar size={16} style={{ color: 'var(--color-electric-blue)' }} />
                                    <span className="font-semibold">{formatDate(project.startDate)}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-secondary project-meta-label">End Date</p>
                                <div className="flex items-center gap-sm">
                                    <Calendar size={16} style={{ color: 'var(--color-electric-violet)' }} />
                                    <span className="font-semibold">{formatDate(project.endDate)}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-secondary project-meta-label">Progress</p>
                                <div className="flex items-center gap-sm">
                                    <span className="text-2xl font-bold gradient-text">{project.progress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="glass-card section-card-body animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-xl font-bold section-card-title gradient-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users size={20} />
                            Team Members
                        </h2>
                        <div className="team-members-grid">
                            {teamMemberDetails.map(member => (
                                <div
                                    key={member.id}
                                    className="team-member-chip"
                                    style={{ cursor: 'pointer', position: 'relative' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setPopupState(prev => prev?.member?.id === member.id ? null : {
                                            member,
                                            top: rect.bottom + window.scrollY + 8,
                                            left: rect.left + window.scrollX
                                        });
                                    }}
                                >
                                    <div className="avatar avatar-sm" style={{ border: '2px solid var(--color-electric-violet)' }}>
                                        <img src={member.avatar} alt={member.name} />
                                    </div>
                                    <span className="text-sm font-semibold">{member.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Portal Popup for Member Interactions */}
                        {popupState && typeof window !== 'undefined' && createPortal(
                            <div
                                ref={popupRef}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    position: 'absolute',
                                    top: popupState.top,
                                    left: popupState.left,
                                    zIndex: 99999,
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                                    padding: '0.75rem',
                                    minWidth: '220px',
                                    animation: 'fadeIn 0.15s ease'
                                }}
                            >
                                {/* Member info header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                                    <img src={popupState.member.avatar} alt={popupState.member.name}
                                        style={{ width: 36, height: 36, borderRadius: '50%' }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontWeight: 700, fontSize: 13 }} className="truncate">{popupState.member.name}</p>
                                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }} className="truncate">
                                            {popupState.member.role || popupState.member.email}
                                        </p>
                                    </div>
                                    <button onClick={() => setPopupState(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
                                        <X size={14} />
                                    </button>
                                </div>

                                {/* Profile info for any member (so you can "view" their profile) */}
                                <div style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                                    <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: 4 }}>Profile</p>
                                    {popupState.member.email && <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{popupState.member.email}</p>}
                                    {popupState.member.role && <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Role: {popupState.member.role}</p>}
                                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Status: {popupState.member.status === 'active' ? 'Active' : popupState.member.status === 'pending' ? 'Pending invite' : popupState.member.status || '—'}</p>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {(() => {
                                        const isCurrentUser = popupState.member.email === currentUser?.email ||
                                            popupState.member.linkedUser === currentUser?.id ||
                                            popupState.member.id === currentUser?.teamMember;

                                        return (
                                            <>
                                                {isCurrentUser && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        style={{ justifyContent: 'flex-start', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: 13, width: '100%' }}
                                                        onClick={() => {
                                                            setPopupState(null);
                                                            navigate('/profile');
                                                        }}
                                                    >
                                                        <User size={15} /> View my profile
                                                    </button>
                                                )}

                                                {!isCurrentUser && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary"
                                                            style={{
                                                                justifyContent: 'flex-start', gap: '8px', padding: '8px 12px', borderRadius: '8px',
                                                                fontSize: 13, width: '100%',
                                                                opacity: popupState.member.status === 'pending' ? 0.6 : 1,
                                                                cursor: popupState.member.status === 'pending' ? 'not-allowed' : 'pointer'
                                                            }}
                                                            title={popupState.member.status === 'pending' ? "Waiting for member to join" : ""}
                                                            onClick={() => {
                                                                if (popupState.member.status === 'pending') return;
                                                                setPopupState(null);
                                                                openChat(popupState.member.linkedUser || popupState.member.id || popupState.member._id);
                                                            }}
                                                        >
                                                            <MessageSquare size={15} /> Send Message
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary"
                                                            style={{ justifyContent: 'flex-start', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: 13, width: '100%', marginTop: '4px' }}
                                                            onClick={() => {
                                                                setPopupState(null);
                                                                navigate(`/profile/${popupState.member.linkedUser || popupState.member.id || popupState.member._id}`);
                                                            }}
                                                        >
                                                            <User size={15} /> View Profile
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>,
                            document.body
                        )}
                    </div>

                    {/* Tasks */}
                    <div className="glass-card section-card-body animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-xl font-bold section-card-title gradient-text">Tasks</h2>
                        <div className="tasks-list">
                            {project.tasks && project.tasks.length > 0 ? (
                                project.tasks.map(task => (
                                    <div key={task.id} className="task-card">
                                        <h3 className="font-bold task-card-title">{task.name}</h3>

                                        {/* Progress Bar */}
                                        <div className="task-progress-block">
                                            <div className="task-progress-header">
                                                <span className="text-xs text-secondary">Progress</span>
                                                <span className="text-xs font-bold">{task.progress}%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
                                            </div>
                                        </div>

                                        {/* Subtasks */}
                                        <div className="subtasks-list">
                                            {task.subtasks && task.subtasks.map(subtask => (
                                                <label
                                                    key={subtask.id}
                                                    className="subtask-item"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={subtask.completed}
                                                        onChange={() => toggleSubtask(project.id, task.id, subtask.id)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                    {subtask.completed ? (
                                                        <CheckCircle2 size={18} style={{ color: 'var(--color-status-completed)' }} />
                                                    ) : (
                                                        <Circle size={18} style={{ color: 'var(--color-text-secondary)' }} />
                                                    )}
                                                    <span className={`subtask-label${subtask.completed ? ' subtask-label--done' : ''}`}>
                                                        {subtask.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-secondary">No tasks yet. Add tasks to get started!</p>
                            )}
                        </div>
                    </div>

                    {/* Project Edit Modal */}
                    <ProjectModal
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        onSave={async (projectData) => {
                            try {
                                await updateProject(project.id, projectData);
                                setShowEditModal(false);
                            } catch (err) {
                                pushNotification({
                                    id: `err-${Date.now()}`,
                                    type: 'error',
                                    title: 'Could not update project',
                                    message: err.message || 'Please try again.',
                                    read: false
                                });
                            }
                        }}
                        project={project}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;

