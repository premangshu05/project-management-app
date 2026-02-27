import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, LogOut, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import NotificationDropdown from '../NotificationDropdown';
import MessagesDrawer from '../MessagesDrawer';

const TopNav = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed, logout, currentUser, projects, unreadCount, unreadMessagesCount, chatOpen, chatTargetUserId, openChat, closeChat } = useApp();
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef(null);

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const results = [];

            // Search projects
            projects.forEach(project => {
                if (project.name.toLowerCase().includes(query) ||
                    project.description.toLowerCase().includes(query)) {
                    results.push({
                        type: 'project',
                        id: project.id,
                        title: project.name,
                        subtitle: project.description,
                        path: `/project/${project.id}`
                    });
                }

                // Search tasks within projects
                project.tasks?.forEach(task => {
                    if (task.name.toLowerCase().includes(query)) {
                        results.push({
                            type: 'task',
                            id: `${project.id}-${task.id}`,
                            title: task.name,
                            subtitle: `in ${project.name}`,
                            path: `/project/${project.id}`
                        });
                    }
                });
            });

            setSearchResults(results.slice(0, 10));
            setShowSearchResults(true);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    }, [searchQuery, projects]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <nav className={`topnav ${sidebarCollapsed ? 'topnav-collapsed' : 'topnav-expanded'}`}>
                {/* Search Bar */}
                <div className="topnav-search" ref={searchRef}>
                    <Search size={18} className="topnav-search-icon" />
                    <input
                        type="text"
                        placeholder="Search projects, tasks, or team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery && setShowSearchResults(true)}
                    />

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                        <div className="glass-card custom-scrollbar search-dropdown">
                            {searchResults.map(result => (
                                <div
                                    key={result.id}
                                    className="search-result-item"
                                    onClick={() => {
                                        navigate(result.path);
                                        setSearchQuery('');
                                        setShowSearchResults(false);
                                    }}
                                >
                                    <div className="search-result-meta">
                                        <span className={`search-result-type search-result-type--${result.type}`}>
                                            {result.type}
                                        </span>
                                    </div>
                                    <p className="font-semibold text-sm search-result-title">{result.title}</p>
                                    <p className="text-xs text-secondary">{result.subtitle}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="topnav-actions">
                    {/* Messages */}
                    <div style={{ position: 'relative' }}>
                        <button
                            className="topnav-icon-btn"
                            onClick={() => openChat()}
                            title="Messages"
                        >
                            <MessageSquare size={20} />
                            {unreadMessagesCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: 4, right: 4,
                                    width: 8, height: 8, borderRadius: '50%',
                                    background: 'var(--color-priority-high)',
                                    display: 'block'
                                }} />
                            )}
                        </button>
                    </div>

                    {/* Notifications */}
                    <div style={{ position: 'relative' }}>
                        <button className="topnav-icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="badge-dot"></span>}
                        </button>
                        <NotificationDropdown
                            isOpen={showNotifications}
                            onClose={() => setShowNotifications(false)}
                        />
                    </div>

                    {/* Settings */}
                    <button className="topnav-icon-btn" onClick={() => navigate('/settings')}>
                        <Settings size={20} />
                    </button>

                    {/* Logout */}
                    <button className="topnav-icon-btn btn-logout" onClick={logout} title="Logout">
                        <LogOut size={20} />
                    </button>

                    {/* Profile */}
                    <div className="topnav-profile" onClick={() => navigate('/profile')}>
                        <div className="topnav-profile-info">
                            <p className="topnav-profile-name">{currentUser?.name || 'Guest'}</p>
                            <p className="topnav-profile-role">{currentUser?.email || 'Not logged in'}</p>
                        </div>
                        <div className="avatar">
                            <img src={currentUser?.avatar || "https://i.pravatar.cc/150?img=33"} alt="Profile" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Global Messages Drawer */}
            <MessagesDrawer
                isOpen={chatOpen}
                onClose={closeChat}
                initialUserId={chatTargetUserId}
            />
        </>
    );
};

export default TopNav;
