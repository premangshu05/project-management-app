import React from 'react';
import { X, TrendingUp, Calendar, Users } from 'lucide-react';

const MemberProjectsModal = ({ isOpen, onClose, member, projects }) => {
    if (!isOpen || !member) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '2rem'
            }}
            onClick={onClose}
        >
            <div
                className="glass-card"
                style={{
                    maxWidth: '700px',
                    width: '100%',
                    maxHeight: '85vh',
                    overflow: 'auto',
                    padding: '0'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '2rem',
                    background: 'var(--color-bg-elevated)',
                    borderBottom: '1px solid var(--color-border)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <img
                                src={member.avatar}
                                alt={member.name}
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    border: '3px solid var(--color-electric-blue)'
                                }}
                            />
                            <div>
                                <h2 className="text-2xl font-bold gradient-text">{member.name}</h2>
                                <p className="text-secondary" style={{ marginTop: '0.25rem' }}>{member.role}</p>
                                <div style={{
                                    marginTop: '0.5rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.25rem 0.75rem',
                                    background: 'rgba(0, 212, 255, 0.2)',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: 'var(--font-size-sm)',
                                    fontWeight: 'bold',
                                    color: 'var(--color-electric-blue)'
                                }}>
                                    <Users size={14} />
                                    {projects.length} Active Project{projects.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Projects List */}
                <div style={{ padding: '0 2rem 2rem 2rem' }}>
                    {projects.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: 'var(--color-text-secondary)'
                        }}>
                            <p>No active projects assigned</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {projects.map((project, index) => (
                                <div
                                    key={project.id}
                                    style={{
                                        padding: '1.5rem',
                                        background: 'var(--color-bg-secondary)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--color-border)',
                                        transition: 'all var(--transition-fast)',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-electric-blue)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-border)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    {/* Project Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 className="font-bold text-lg">{project.name}</h3>
                                            <p className="text-sm text-secondary" style={{ marginTop: '0.25rem' }}>
                                                {project.description}
                                            </p>
                                        </div>
                                        <div style={{
                                            padding: '0.5rem 1rem',
                                            background: project.priority === 'Critical' ? 'rgba(239, 68, 68, 0.2)' :
                                                project.priority === 'High' ? 'rgba(245, 158, 11, 0.2)' :
                                                    project.priority === 'Medium' ? 'rgba(59, 130, 246, 0.2)' :
                                                        'rgba(107, 114, 128, 0.2)',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: 'var(--font-size-xs)',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                            marginLeft: '1rem'
                                        }}>
                                            {project.priority}
                                        </div>
                                    </div>

                                    {/* Project Stats */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '1rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{
                                            padding: '0.75rem',
                                            background: 'var(--color-bg-elevated)',
                                            borderRadius: 'var(--radius-md)',
                                            textAlign: 'center'
                                        }}>
                                            <div className="text-xs text-secondary" style={{ marginBottom: '0.25rem' }}>Status</div>
                                            <div className="font-bold text-sm">{project.status}</div>
                                        </div>
                                        <div style={{
                                            padding: '0.75rem',
                                            background: 'var(--color-bg-elevated)',
                                            borderRadius: 'var(--radius-md)',
                                            textAlign: 'center'
                                        }}>
                                            <div className="text-xs text-secondary" style={{ marginBottom: '0.25rem' }}>Category</div>
                                            <div className="font-bold text-sm">{project.category}</div>
                                        </div>
                                        <div style={{
                                            padding: '0.75rem',
                                            background: 'var(--color-bg-elevated)',
                                            borderRadius: 'var(--radius-md)',
                                            textAlign: 'center'
                                        }}>
                                            <div className="text-xs text-secondary" style={{ marginBottom: '0.25rem' }}>
                                                <Calendar size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                                Timeline
                                            </div>
                                            <div className="font-bold text-sm">
                                                {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                                            <span className="text-xs font-semibold flex items-center gap-sm">
                                                <TrendingUp size={14} />
                                                Progress
                                            </span>
                                            <span className="text-sm font-bold gradient-text">{project.progress}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${project.progress}%`,
                                                    background: project.progress === 100 ? 'var(--color-status-completed)' :
                                                        project.progress >= 75 ? 'var(--color-electric-blue)' :
                                                            project.progress >= 50 ? 'var(--color-priority-medium)' :
                                                                'var(--color-priority-high)'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemberProjectsModal;
