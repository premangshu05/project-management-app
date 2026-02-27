import React from 'react';
import { Bell, Check, CheckCheck, X, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NotificationDropdown = ({ isOpen, onClose }) => {
    const { notifications, markNotificationRead, markAllNotificationsRead, clearAllNotifications } = useApp();

    if (!isOpen) return null;

    const unreadNotifications = notifications.filter(n => !n.read);

    const typeLabel = (type) => {
        const map = {
            task: { label: 'Task', color: 'var(--color-status-completed)' },
            deadline: { label: 'Deadline', color: 'var(--color-priority-high)' },
            mention: { label: 'Mention', color: 'var(--color-electric-blue)' },
            assignment: { label: 'Team', color: 'var(--color-electric-violet)' }
        };
        return map[type] || { label: type, color: 'var(--color-text-muted)' };
    };

    const getNotificationIcon = (type) => {
        const iconProps = { size: 18 };
        switch (type) {
            case 'task':
                return <Check {...iconProps} style={{ color: 'var(--color-status-completed)' }} />;
            case 'deadline':
                return <Bell {...iconProps} style={{ color: 'var(--color-priority-high)' }} />;
            case 'mention':
                return <span style={{ fontSize: '18px' }}>@</span>;
            case 'assignment':
                return <span style={{ fontSize: '18px' }}>📋</span>;
            default:
                return <Bell {...iconProps} />;
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999
                }}
                onClick={onClose}
            />

            {/* Dropdown */}
            <div
                className="glass-card custom-scrollbar"
                style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    width: '400px',
                    maxWidth: '90vw',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    padding: '1rem'
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--color-border)'
                }}>
                    <h3 className="font-bold">
                        Notifications
                        {unreadNotifications.length > 0 && (
                            <span style={{
                                marginLeft: '0.5rem',
                                padding: '0.125rem 0.5rem',
                                background: 'var(--gradient-accent)',
                                borderRadius: 'var(--radius-full)',
                                fontSize: 'var(--font-size-xs)',
                                fontWeight: 600
                            }}>
                                {unreadNotifications.length}
                            </span>
                        )}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        {unreadNotifications.length > 0 && (
                            <button
                                onClick={markAllNotificationsRead}
                                className="text-sm"
                                style={{
                                    color: 'var(--color-electric-blue)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'all var(--transition-fast)'
                                }}
                                title="Mark all as read"
                            >
                                <CheckCheck size={14} />
                                All read
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                onClick={clearAllNotifications}
                                className="text-sm"
                                style={{
                                    color: 'var(--color-priority-high)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'all var(--transition-fast)'
                                }}
                                title="Clear all notifications"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                {notifications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                onClick={() => markNotificationRead(notification.id)}
                                style={{
                                    padding: '0.75rem',
                                    background: notification.read ? 'transparent' : 'rgba(0, 212, 255, 0.05)',
                                    border: `1px solid ${notification.read ? 'var(--color-border)' : 'rgba(0, 212, 255, 0.2)'}`,
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-fast)',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = notification.read ? 'transparent' : 'rgba(0, 212, 255, 0.05)';
                                    e.currentTarget.style.borderColor = notification.read ? 'var(--color-border)' : 'rgba(0, 212, 255, 0.2)';
                                }}
                            >
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--color-bg-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <p className="font-semibold text-sm">{notification.title}</p>
                                            <span style={{
                                                fontSize: '10px',
                                                padding: '1px 6px',
                                                borderRadius: '99px',
                                                background: `${typeLabel(notification.type).color}22`,
                                                color: typeLabel(notification.type).color,
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>{typeLabel(notification.type).label}</span>
                                        </div>
                                        <p className="text-xs text-secondary" style={{ marginBottom: '0.25rem' }}>
                                            {notification.message}
                                        </p>
                                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                            {notification.time}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: 'var(--color-electric-blue)',
                                            flexShrink: 0,
                                            marginTop: '0.5rem'
                                        }} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem 1rem',
                        color: 'var(--color-text-secondary)'
                    }}>
                        <Bell size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>All caught up!</p>
                        <p style={{ fontSize: '13px', opacity: 0.7 }}>No notifications right now</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default NotificationDropdown;
