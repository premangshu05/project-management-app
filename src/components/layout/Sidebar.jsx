import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderKanban,
    Calendar,
    BarChart3,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    Target,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateProjectProgress } from '../../utils/progressCalculator';

const Sidebar = () => {
    const { sidebarCollapsed, setSidebarCollapsed, projects } = useApp();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: FolderKanban, label: 'Projects', path: '/projects' },
        { icon: Calendar, label: 'Calendar', path: '/calendar' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Users, label: 'Team', path: '/team' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    // Calculate stats
    const totalProjects = projects?.length || 0;
    const activeProjects = projects?.filter(p => !['Completed', 'On Hold'].includes(p.status)).length || 0;
    const completedProjects = projects?.filter(p => p.status === 'Completed').length || 0;
    const avgProgress = projects?.length > 0
        ? Math.round(projects.reduce((sum, p) => sum + calculateProjectProgress(p.tasks || []), 0) / projects.length)
        : 0;

    return (
        <aside className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
            {/* Logo Section */}
            <div className="sidebar-header">
                {!sidebarCollapsed && (
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-icon">
                            <span>P</span>
                        </div>
                        <div className="sidebar-logo-text">
                            <h1 className="gradient-text">ProzexiS</h1>
                            <p>Where Projects Turn Into Progress</p>
                        </div>
                    </div>
                )}
                {sidebarCollapsed && (
                    <div className="sidebar-logo-icon" style={{ margin: '0 auto' }}>
                        <span>P</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-nav-item ${isActive ? 'active' : ''} ${sidebarCollapsed ? 'sidebar-nav-item-collapsed' : ''}`
                        }
                    >
                        <item.icon />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Stats Overview */}
            {!sidebarCollapsed && (
                <div className="sidebar-stats">
                    <div className="sidebar-stat-item">
                        <div className="flex items-center gap-sm">
                            <Target size={16} style={{ color: 'var(--color-electric-blue)' }} />
                            <span className="sidebar-stat-label">Total Projects</span>
                        </div>
                        <span className="sidebar-stat-value">{totalProjects}</span>
                    </div>
                    <div className="sidebar-stat-item">
                        <div className="flex items-center gap-sm">
                            <Clock size={16} style={{ color: 'var(--color-status-progress)' }} />
                            <span className="sidebar-stat-label">Active Projects</span>
                        </div>
                        <span className="sidebar-stat-value">{activeProjects}</span>
                    </div>
                    <div className="sidebar-stat-item">
                        <div className="flex items-center gap-sm">
                            <CheckCircle2 size={16} style={{ color: 'var(--color-status-completed)' }} />
                            <span className="sidebar-stat-label">Completed</span>
                        </div>
                        <span className="sidebar-stat-value">{completedProjects}</span>
                    </div>
                    <div className="sidebar-stat-item">
                        <div className="flex items-center gap-sm">
                            <BarChart3 size={16} style={{ color: 'var(--color-electric-violet)' }} />
                            <span className="sidebar-stat-label">Avg Progress</span>
                        </div>
                        <span className="sidebar-stat-value">{avgProgress}%</span>
                    </div>
                </div>
            )}

            {/* Collapse Toggle */}
            <div className="sidebar-toggle">
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="sidebar-toggle-btn"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight size={20} />
                    ) : (
                        <>
                            <ChevronLeft size={20} />
                            <span className="text-sm">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
