import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed, projects } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(100);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    const zoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 150));
    const zoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 70));

    const getProjectsForDate = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return projects.filter(project => dateStr >= project.startDate && dateStr <= project.endDate);
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);

    return (
        <div className="main-layout">
            <Sidebar />
            <div className={`main-content ${sidebarCollapsed ? 'main-content-collapsed' : 'main-content-expanded'}`}>
                <TopNav />
                <div className="page-container">
                    {/* Header */}
                    <div className="page-header">
                        <h1 className="text-3xl font-bold gradient-text">Calendar</h1>
                        <p className="text-secondary page-subtitle">View projects by timeline</p>
                    </div>

                    {/* Calendar Controls */}
                    <div className="glass-card calendar-controls">
                        <div className="calendar-controls-inner">
                            <button className="btn btn-secondary" onClick={previousMonth}>
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className="text-2xl font-bold">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <div className="calendar-zoom-group">
                                <button className="btn btn-ghost" onClick={zoomOut} title="Zoom Out">
                                    <ZoomOut size={20} />
                                </button>
                                <span className="text-sm font-semibold calendar-zoom-label">{zoomLevel}%</span>
                                <button className="btn btn-ghost" onClick={zoomIn} title="Zoom In">
                                    <ZoomIn size={20} />
                                </button>
                                <button className="btn btn-secondary" onClick={nextMonth}>
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="glass-card calendar-grid-wrapper">
                        {/* Weekday Headers */}
                        <div className="calendar-weekdays">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className={`calendar-weekday ${day === 'Sun' || day === 'Sat' ? 'calendar-weekday--weekend' : ''}`}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="calendar-days">
                            {days.map((day, index) => {
                                const dayProjects = day ? getProjectsForDate(day) : [];
                                const isToday = day &&
                                    day === new Date().getDate() &&
                                    currentDate.getMonth() === new Date().getMonth() &&
                                    currentDate.getFullYear() === new Date().getFullYear();

                                const isWeekend = index % 7 === 0 || index % 7 === 6;

                                const dayClass = [
                                    'calendar-day',
                                    day ? 'calendar-day--filled' : 'calendar-day--empty',
                                    isToday ? 'calendar-day--today' : '',
                                    day && dayProjects.length > 0 ? 'calendar-day--clickable' : '',
                                    isWeekend && day && !isToday ? 'calendar-day--weekend' : ''
                                ].filter(Boolean).join(' ');

                                return (
                                    <div
                                        key={index}
                                        className={dayClass}
                                        style={{ minHeight: `${120 * (zoomLevel / 100)}px` }}
                                        onClick={() => {
                                            if (day && dayProjects.length > 0) {
                                                setSelectedDay({ day, projects: dayProjects });
                                            }
                                        }}
                                    >
                                        {day && (
                                            <>
                                                <div className="font-bold text-sm calendar-day-number">{day}</div>
                                                {dayProjects.length > 0 && (
                                                    <div className="calendar-day-events">
                                                        {dayProjects.slice(0, 2).map(project => (
                                                            <div
                                                                key={project.id}
                                                                className="calendar-event-chip"
                                                                style={{
                                                                    background: `rgba(${project.priority === 'Critical' ? '239, 68, 68' : project.priority === 'High' ? '245, 158, 11' : '59, 130, 246'}, 0.2)`
                                                                }}
                                                            >
                                                                {project.name}
                                                            </div>
                                                        ))}
                                                        {dayProjects.length > 2 && (
                                                            <div className="text-xs font-semibold calendar-event-more">
                                                                +{dayProjects.length - 2} more
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Day Projects Modal */}
                    {selectedDay && (
                        <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
                            <div
                                className="glass-card modal-container"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="calendar-modal-header">
                                    <h2 className="text-2xl font-bold">
                                        {monthNames[currentDate.getMonth()]} {selectedDay.day}, {currentDate.getFullYear()}
                                    </h2>
                                    <button onClick={() => setSelectedDay(null)} className="btn btn-ghost btn-icon-sm">
                                        ×
                                    </button>
                                </div>
                                <p className="text-sm text-secondary calendar-modal-meta">
                                    {selectedDay.projects.length} project{selectedDay.projects.length !== 1 ? 's' : ''} active on this day
                                </p>
                                <div className="calendar-modal-projects">
                                    {selectedDay.projects.map(project => (
                                        <div
                                            key={project.id}
                                            className="glass-card calendar-project-card"
                                            onClick={() => {
                                                navigate(`/project/${project.id}`);
                                                setSelectedDay(null);
                                            }}
                                        >
                                            <div className="calendar-project-header">
                                                <h3 className="font-bold">{project.name}</h3>
                                                <span className={`badge badge-priority-${project.priority.toLowerCase()}`}>
                                                    {project.priority}
                                                </span>
                                            </div>
                                            <p className="text-xs text-secondary calendar-project-dates">
                                                {project.startDate} → {project.endDate}
                                            </p>
                                            <div className="calendar-progress-row">
                                                <div className="progress-bar" style={{ flex: 1 }}>
                                                    <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold">{project.progress}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
