import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import TopNav from "../components/layout/TopNav";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import AIAssistant from "../components/AIAssistant";
import { useApp } from "../context/AppContext";
import { TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { sidebarCollapsed, projects, addProject } = useApp();
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Calculate dashboard stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => !["Completed", "On Hold"].includes(p.status),
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "Completed",
  ).length;
  const blockedProjects = projects.filter((p) => p.status === "On Hold").length;

  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: TrendingUp,
      color: "var(--color-electric-blue)",
      bgColor: "rgba(0, 212, 255, 0.1)",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      icon: Clock,
      color: "var(--color-status-progress)",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      label: "Completed",
      value: completedProjects,
      icon: CheckCircle2,
      color: "var(--color-status-completed)",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      label: "On Hold",
      value: blockedProjects,
      icon: AlertCircle,
      color: "var(--color-priority-critical)",
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
  ];

  return (
    <div className="main-layout">
      <Sidebar />
      <div
        className={`main-content ${sidebarCollapsed ? "main-content-collapsed" : "main-content-expanded"}`}
      >
        <TopNav />
        <div className="page-container">
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title gradient-text">Dashboard</h1>
            <p className="text-secondary">
              Welcome back! Here's what's happening with your projects.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card stat-card">
                <div className="stat-card-body">
                  <div>
                    <p className="stat-label">{stat.label}</p>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                  <div
                    className="stat-card-icon"
                    style={{ background: stat.bgColor }}
                  >
                    <stat.icon size={24} style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Projects Section */}
          <div className="page-header-row">
            <h2 className="text-2xl font-bold">Active Projects</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowProjectModal(true)}
            >
              + New Project
            </button>
          </div>

          {/* Projects Grid */}
          <div className="dashboard-grid">
            {projects
              .filter((p) => !["Completed", "On Hold"].includes(p.status))
              .map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`/project/${project.id}`)}
                />
              ))}
          </div>

          {/* AI Assistant */}
          <AIAssistant />

          {/* Project Modal */}
          <ProjectModal
            isOpen={showProjectModal}
            onClose={() => setShowProjectModal(false)}
            onSave={(projectData) => {
              addProject(projectData);
              setShowProjectModal(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
