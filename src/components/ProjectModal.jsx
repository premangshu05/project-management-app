import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ProjectModal = ({ isOpen, onClose, onSave, project = null }) => {
    const { teamMembers } = useApp();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        priority: 'Medium',
        category: 'Full Stack',
        status: 'Planning',
        assignedTeam: [],
        tasks: []
    });

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                description: project.description || '',
                startDate: project.startDate || '',
                endDate: project.endDate || '',
                priority: project.priority || 'Medium',
                category: project.category || 'Full Stack',
                status: project.status || 'Planning',
                assignedTeam: project.assignedTeam || [],
                tasks: project.tasks || []
            });
        } else {
            setFormData({
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                priority: 'Medium',
                category: 'Full Stack',
                status: 'Planning',
                assignedTeam: [],
                tasks: []
            });
        }
    }, [project, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await Promise.resolve(onSave(formData));
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleTeamMember = (memberId) => {
        const id = String(memberId);
        setFormData(prev => {
            const currentTeamIds = prev.assignedTeam.map(entry =>
                (entry && typeof entry === 'object') ? String(entry.id || entry._id) : String(entry)
            );

            return {
                ...prev,
                assignedTeam: currentTeamIds.includes(id)
                    ? prev.assignedTeam.filter(entry => {
                        const entryId = (entry && typeof entry === 'object') ? String(entry.id || entry._id) : String(entry);
                        return entryId !== id;
                    })
                    : [...prev.assignedTeam, id]
            };
        });
    };

    // Helper: check if member is selected (handles both string and object forms)
    const isMemberSelected = (memberId) => {
        const id = String(memberId);
        return formData.assignedTeam.some(entry => {
            const entryId = (entry && typeof entry === 'object') ? String(entry.id || entry._id) : String(entry);
            return entryId === id;
        });
    };

    // Task management functions
    const addTask = () => {
        const newTask = {
            id: Date.now(),
            name: '',
            subtasks: []
        };
        setFormData(prev => ({
            ...prev,
            tasks: [...prev.tasks, newTask]
        }));
    };

    const updateTaskName = (taskId, name) => {
        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
                task.id === taskId ? { ...task, name } : task
            )
        }));
    };

    const deleteTask = (taskId) => {
        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.filter(task => task.id !== taskId)
        }));
    };

    const addSubtask = (taskId) => {
        const newSubtask = {
            id: Date.now(),
            name: '',
            completed: false
        };
        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
                task.id === taskId
                    ? { ...task, subtasks: [...task.subtasks, newSubtask] }
                    : task
            )
        }));
    };

    const updateSubtaskName = (taskId, subtaskId, name) => {
        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
                task.id === taskId
                    ? {
                        ...task,
                        subtasks: task.subtasks.map(subtask =>
                            subtask.id === subtaskId ? { ...subtask, name } : subtask
                        )
                    }
                    : task
            )
        }));
    };

    const deleteSubtask = (taskId, subtaskId) => {
        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
                task.id === taskId
                    ? { ...task, subtasks: task.subtasks.filter(s => s.id !== subtaskId) }
                    : task
            )
        }));
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
        }} onClick={onClose}>
            <div
                className="glass-card custom-scrollbar"
                style={{
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '2rem',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2 className="text-2xl font-bold gradient-text">
                        {project ? 'Edit Project' : 'Create New Project'}
                    </h2>
                    <button onClick={onClose} style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 'var(--radius-md)',
                        transition: 'all var(--transition-fast)'
                    }} onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.color = 'var(--color-text-primary)';
                    }} onMouseLeave={(e) => {
                        e.target.style.background = 'none';
                        e.target.style.color = 'var(--color-text-secondary)';
                    }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Project Name */}
                    <div>
                        <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Project Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter project name"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                color: 'var(--color-text-primary)',
                                fontSize: 'var(--font-size-base)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter project description"
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                color: 'var(--color-text-primary)',
                                fontSize: 'var(--font-size-base)',
                                outline: 'none',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    {/* Dates */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Start Date *
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-base)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                End Date *
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-base)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {/* Priority, Category, Status */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-base)',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-base)',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="Full Stack">Full Stack</option>
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="DevOps">DevOps</option>
                                <option value="UI/UX">UI/UX</option>
                                <option value="Testing">Testing</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-base)',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="Planning">Planning</option>
                                <option value="In Progress">In Progress</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Review">Review</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* Team Assignment */}
                    <div>
                        <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.75rem' }}>
                            Assign Team Members
                        </label>
                        {teamMembers.length === 0 ? (
                            <p className="text-sm text-secondary" style={{ fontStyle: 'italic', padding: '0.75rem' }}>
                                No team members yet. Add members from the Team page first.
                            </p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {teamMembers.map(member => (
                                    <label key={member.id || member._id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem',
                                        background: isMemberSelected(member.id || member._id) ? 'rgba(0, 212, 255, 0.1)' : 'var(--color-bg-secondary)',
                                        border: `1px solid ${isMemberSelected(member.id || member._id) ? 'rgba(0, 212, 255, 0.3)' : 'var(--color-border)'}`,
                                        borderRadius: 'var(--radius-lg)',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={isMemberSelected(member.id || member._id)}
                                            onChange={() => toggleTeamMember(member.id || member._id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <img src={member.avatar} alt={member.name} className="avatar avatar-sm" />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p className="text-sm font-semibold" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {member.name}
                                            </p>
                                            <p className="text-xs text-secondary" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {member.role}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tasks Section */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <label className="text-sm font-semibold">
                                Tasks & Subtasks
                            </label>
                            <button
                                type="button"
                                onClick={addTask}
                                className="btn btn-secondary"
                                style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--font-size-sm)' }}
                            >
                                + Add Task
                            </button>
                        </div>

                        {formData.tasks.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {formData.tasks.map((task, taskIndex) => (
                                    <div
                                        key={task.id}
                                        style={{
                                            padding: '1rem',
                                            background: 'var(--color-bg-secondary)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-lg)'
                                        }}
                                    >
                                        {/* Task Name */}
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                            <input
                                                type="text"
                                                value={task.name}
                                                onChange={(e) => updateTaskName(task.id, e.target.value)}
                                                placeholder={`Task ${taskIndex + 1} name`}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.5rem',
                                                    background: 'var(--color-bg-elevated)',
                                                    border: '1px solid var(--color-border)',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'var(--color-text-primary)',
                                                    fontSize: 'var(--font-size-sm)',
                                                    fontWeight: 600,
                                                    outline: 'none'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => deleteTask(task.id)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'var(--color-priority-critical)',
                                                    cursor: 'pointer',
                                                    fontSize: 'var(--font-size-xs)',
                                                    fontWeight: 600
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        {/* Subtasks */}
                                        <div style={{ marginLeft: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span className="text-xs text-secondary font-semibold">SUBTASKS</span>
                                                <button
                                                    type="button"
                                                    onClick={() => addSubtask(task.id)}
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        background: 'rgba(0, 212, 255, 0.1)',
                                                        border: '1px solid rgba(0, 212, 255, 0.3)',
                                                        borderRadius: 'var(--radius-sm)',
                                                        color: 'var(--color-electric-blue)',
                                                        cursor: 'pointer',
                                                        fontSize: 'var(--font-size-xs)',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    + Add Subtask
                                                </button>
                                            </div>

                                            {task.subtasks && task.subtasks.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {task.subtasks.map((subtask, subtaskIndex) => (
                                                        <div
                                                            key={subtask.id}
                                                            style={{
                                                                display: 'flex',
                                                                gap: '0.5rem',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <span className="text-xs text-secondary" style={{ minWidth: '20px' }}>
                                                                {subtaskIndex + 1}.
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={subtask.name}
                                                                onChange={(e) => updateSubtaskName(task.id, subtask.id, e.target.value)}
                                                                placeholder={`Subtask ${subtaskIndex + 1}`}
                                                                style={{
                                                                    flex: 1,
                                                                    padding: '0.5rem',
                                                                    background: 'var(--color-bg-elevated)',
                                                                    border: '1px solid var(--color-border)',
                                                                    borderRadius: 'var(--radius-sm)',
                                                                    color: 'var(--color-text-primary)',
                                                                    fontSize: 'var(--font-size-xs)',
                                                                    outline: 'none'
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteSubtask(task.id, subtask.id)}
                                                                style={{
                                                                    padding: '0.25rem 0.5rem',
                                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                                                    borderRadius: 'var(--radius-sm)',
                                                                    color: 'var(--color-priority-critical)',
                                                                    cursor: 'pointer',
                                                                    fontSize: 'var(--font-size-xs)'
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-secondary" style={{ fontStyle: 'italic', padding: '0.5rem' }}>
                                                    No subtasks yet. Click "Add Subtask" to create one.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                padding: '2rem',
                                textAlign: 'center',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px dashed var(--color-border)'
                            }}>
                                <p className="text-sm text-secondary">No tasks yet. Click "Add Task" to create one.</p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                            {saving ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
