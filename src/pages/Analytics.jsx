import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import { useApp } from '../context/AppContext';
import { TrendingUp, Clock, CheckCircle2, AlertCircle, BarChart3, PieChart, Activity } from 'lucide-react';

const Analytics = () => {
    const { sidebarCollapsed, projects } = useApp();

    // Calculate analytics
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
    const onHoldProjects = projects.filter(p => p.status === 'On Hold').length;

    const avgProgress = projects.length > 0
        ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
        : 0;

    const priorityCounts = {
        Critical: projects.filter(p => p.priority === 'Critical').length,
        High: projects.filter(p => p.priority === 'High').length,
        Medium: projects.filter(p => p.priority === 'Medium').length,
        Low: projects.filter(p => p.priority === 'Low').length
    };

    const statusCounts = {
        Planning: projects.filter(p => p.status === 'Planning').length,
        'In Progress': inProgressProjects,
        'On Hold': onHoldProjects,
        Review: projects.filter(p => p.status === 'Review').length,
        Completed: completedProjects
    };

    return (
        <div className="main-layout">
            <Sidebar />
            <div className={`main-content ${sidebarCollapsed ? 'main-content-collapsed' : 'main-content-expanded'}`}>
                <TopNav />
                <div className="page-container">

                    {/* Header */}
                    <div className="page-header">
                        <h1 className="page-title gradient-text">Analytics</h1>
                        <p className="page-subtitle">Project insights and metrics</p>
                    </div>

                    {/* Key Metrics */}
                    <div className="stats-grid">
                        <div className="glass-card stat-card">
                            <div className="stat-card-body-col">
                                <TrendingUp size={24} style={{ color: 'var(--color-electric-blue)' }} />
                                <span className="text-xs text-secondary">TOTAL</span>
                            </div>
                            <h3 className="stat-value gradient-text">{totalProjects}</h3>
                            <p className="stat-sublabel">Total Projects</p>
                        </div>

                        <div className="glass-card stat-card">
                            <div className="stat-card-body-col">
                                <Activity size={24} style={{ color: 'var(--color-status-progress)' }} />
                                <span className="text-xs text-secondary">ACTIVE</span>
                            </div>
                            <h3 className="stat-value" style={{ color: 'var(--color-status-progress)' }}>{inProgressProjects}</h3>
                            <p className="stat-sublabel">In Progress</p>
                        </div>

                        <div className="glass-card stat-card">
                            <div className="stat-card-body-col">
                                <CheckCircle2 size={24} style={{ color: 'var(--color-status-completed)' }} />
                                <span className="text-xs text-secondary">DONE</span>
                            </div>
                            <h3 className="stat-value" style={{ color: 'var(--color-status-completed)' }}>{completedProjects}</h3>
                            <p className="stat-sublabel">Completed</p>
                        </div>

                        <div className="glass-card stat-card">
                            <div className="stat-card-body-col">
                                <BarChart3 size={24} style={{ color: 'var(--color-electric-violet)' }} />
                                <span className="text-xs text-secondary">AVG</span>
                            </div>
                            <h3 className="stat-value gradient-text">{avgProgress}%</h3>
                            <p className="stat-sublabel">Average Progress</p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="charts-grid">
                        {/* Status Distribution */}
                        <div className="glass-card section-card">
                            <h2 className="text-xl font-bold section-card-header">
                                <PieChart size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                Status Distribution
                            </h2>
                            <div className="chart-bar-list">
                                {Object.entries(statusCounts).map(([status, count]) => {
                                    const percentage = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0;
                                    return (
                                        <div key={status}>
                                            <div className="chart-bar-item-header">
                                                <span className="text-sm font-semibold">{status}</span>
                                                <span className="text-sm text-secondary">{count} ({percentage}%)</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Priority Distribution */}
                        <div className="glass-card section-card">
                            <h2 className="text-xl font-bold section-card-header">
                                <AlertCircle size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                Priority Distribution
                            </h2>
                            <div className="chart-bar-list">
                                {Object.entries(priorityCounts).map(([priority, count]) => {
                                    const percentage = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0;
                                    const color = priority === 'Critical' ? 'var(--color-priority-critical)' :
                                        priority === 'High' ? 'var(--color-priority-high)' :
                                            priority === 'Medium' ? 'var(--color-priority-medium)' :
                                                'var(--color-priority-low)';
                                    return (
                                        <div key={priority}>
                                            <div className="chart-bar-item-header">
                                                <span className="text-sm font-semibold">{priority}</span>
                                                <span className="text-sm text-secondary">{count} ({percentage}%)</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${percentage}%`, background: color }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Recent Projects */}
                    <div className="glass-card section-card" style={{ marginTop: '1.5rem' }}>
                        <h2 className="text-xl font-bold section-card-header">Recent Projects</h2>
                        <div className="recent-project-list">
                            {projects.slice(0, 5).map(project => (
                                <div key={project.id} className="recent-project-row">
                                    <div className="recent-project-info">
                                        <h3 className="font-bold">{project.name}</h3>
                                        <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>
                                            {project.category}
                                        </p>
                                    </div>
                                    <div className="recent-project-meta">
                                        <span className={`badge badge-priority-${project.priority.toLowerCase()}`}>
                                            {project.priority}
                                        </span>
                                        <div className="recent-project-progress">
                                            <div className="chart-bar-item-header">
                                                <span className="text-xs text-secondary">Progress</span>
                                                <span className="text-xs font-bold">{project.progress}%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Analytics;
