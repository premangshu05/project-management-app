import React from 'react';
import { Calendar, Flag, Users, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/dateHelpers';
import ProgressIndicator from './ProgressIndicator';
import { calculateProjectProgress } from '../utils/progressCalculator';
import { useApp } from '../context/AppContext';

const ProjectCard = ({ project, onClick }) => {
    const { teamMembers } = useApp();
    const { name, description, startDate, endDate, priority, category, status, assignedTeam, tasks } = project;
    const progress = calculateProjectProgress(tasks);

    // Resolve assigned team members — handles populated objects or raw ID strings
    const teamMemberDetails = (assignedTeam || []).map(entry => {
        if (entry && typeof entry === 'object' && entry.name) {
            return { id: entry.id || entry._id, name: entry.name, avatar: entry.avatar };
        }
        const found = teamMembers.find(m => String(m.id) === String(entry) || String(m._id) === String(entry));
        return found ? { id: found.id, name: found.name, avatar: found.avatar } : null;
    }).filter(Boolean);

    return (
        <div onClick={onClick} className="project-card">
            {/* Header */}
            <div className="project-card-header">
                <div style={{ flex: 1 }}>
                    <h3 className="project-card-title">{name}</h3>
                    <p className="project-card-description">{description}</p>
                </div>
                <ProgressIndicator progress={progress} size="md" />
            </div>

            {/* Metadata */}
            <div className="project-card-meta">
                <div className="project-card-meta-item">
                    <Calendar size={14} />
                    <span>{formatDate(startDate)}</span>
                </div>
                <div className="project-card-meta-item">
                    <ArrowRight size={14} />
                    <span>{formatDate(endDate)}</span>
                </div>
            </div>

            {/* Badges */}
            <div className="project-card-badges">
                {/* Priority Badge */}
                <span className={`badge badge-priority-${priority.toLowerCase()}`}>
                    <Flag size={12} />
                    {priority}
                </span>

                {/* Category Badge */}
                <span className="badge badge-category">
                    {category}
                </span>

                {/* Status Badge */}
                <span className={`badge badge-status-${status.toLowerCase().replace(/\s+/g, '')}`}>
                    {status}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="project-card-progress">
                <div className="project-card-progress-header">
                    <span className="project-card-progress-label">Overall Progress</span>
                    <span className="project-card-progress-value">{progress}%</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Team Members */}
            <div className="project-card-team">
                <div className="flex items-center gap-sm">
                    <Users size={16} style={{ color: 'var(--color-text-secondary)' }} />
                    <span className="text-xs text-secondary">Team</span>
                </div>
                <div className="avatar-group">
                    {teamMemberDetails.slice(0, 4).map((member) => (
                        <div key={member.id} className="avatar avatar-sm" title={member.name}>
                            <img src={member.avatar} alt={member.name} />
                        </div>
                    ))}
                    {assignedTeam.length > 4 && (
                        <div className="avatar avatar-sm" style={{
                            background: 'var(--color-bg-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 600
                        }}>
                            +{assignedTeam.length - 4}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
