import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { useApp } from '../context/AppContext';
import { Filter, Grid, List, Plus } from 'lucide-react';

const Projects = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed, projects, addProject, pushNotification } = useApp();
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    const getFilteredProjects = () => {
        let filtered = [...projects];

        if (filterStatus !== 'all') {
            filtered = filtered.filter(p => p.status.toLowerCase().replace(/\s+/g, '') === filterStatus);
        }

        if (filterPriority !== 'all') {
            filtered = filtered.filter(p => p.priority.toLowerCase() === filterPriority);
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name': return a.name.localeCompare(b.name);
                case 'date': return new Date(a.startDate) - new Date(b.startDate);
                case 'progress': return b.progress - a.progress;
                default: return 0;
            }
        });

        return filtered;
    };

    const filteredProjects = getFilteredProjects();

    return (
        <div className="main-layout">
            <Sidebar />
            <div className={`main-content ${sidebarCollapsed ? 'main-content-collapsed' : 'main-content-expanded'}`}>
                <TopNav />
                <div className="page-container">

                    {/* Header */}
                    <div className="page-header">
                        <div className="page-header-row">
                            <div>
                                <h1 className="page-title gradient-text">All Projects</h1>
                                <p className="page-subtitle">Manage and track all your projects</p>
                            </div>
                            <button className="btn btn-primary" onClick={() => setShowProjectModal(true)}>
                                <Plus size={20} />
                                New Project
                            </button>
                        </div>

                        {/* Filters and View Controls */}
                        <div className="glass-card filter-bar">
                            <div className="filter-bar-inner">
                                {/* Filters */}
                                <div className="filter-group">
                                    <div className="filter-item">
                                        <label className="form-label-xs">Status</label>
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="btn btn-secondary filter-select"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="planning">Planning</option>
                                            <option value="inprogress">In Progress</option>
                                            <option value="onhold">On Hold</option>
                                            <option value="review">Review</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>

                                    <div className="filter-item">
                                        <label className="form-label-xs">Priority</label>
                                        <select
                                            value={filterPriority}
                                            onChange={(e) => setFilterPriority(e.target.value)}
                                            className="btn btn-secondary filter-select"
                                        >
                                            <option value="all">All Priorities</option>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="critical">Critical</option>
                                        </select>
                                    </div>

                                    <div className="filter-item">
                                        <label className="form-label-xs">Sort By</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="btn btn-secondary filter-select"
                                        >
                                            <option value="name">Name</option>
                                            <option value="date">Start Date</option>
                                            <option value="progress">Progress</option>
                                        </select>
                                    </div>
                                </div>

                                {/* View Mode Toggle */}
                                <div className="view-toggle">
                                    <button
                                        className={`btn btn-icon ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        className={`btn btn-icon ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Projects Grid/List */}
                    {filteredProjects.length > 0 ? (
                        <div className={viewMode === 'grid' ? 'projects-grid' : 'projects-list'}>
                            {filteredProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onClick={() => navigate(`/project/${project.id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card empty-state">
                            <Filter size={48} className="empty-state-icon" />
                            <p className="text-secondary">No projects match your filters</p>
                            <button
                                className="btn btn-ghost empty-state-action"
                                onClick={() => {
                                    setFilterStatus('all');
                                    setFilterPriority('all');
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Project Modal */}
                    <ProjectModal
                        isOpen={showProjectModal}
                        onClose={() => setShowProjectModal(false)}
                        onSave={async (projectData) => {
                            try {
                                await addProject(projectData);
                                setShowProjectModal(false);
                            } catch (err) {
                                pushNotification({
                                    id: `err-${Date.now()}`,
                                    type: 'error',
                                    title: 'Could not create project',
                                    message: err.message || 'Please try again.',
                                    read: false
                                });
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Projects;
