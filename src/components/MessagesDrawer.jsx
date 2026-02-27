import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, MessageSquare, Search, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
    fetchConversations,
    fetchConversation,
    sendMessageApi,
    markMessagesReadApi,
    editMessageApi,
    deleteMessageApi
} from '../api';

const MessagesDrawer = ({ isOpen, onClose, initialUserId = null }) => {
    const { currentUser, teamMembers, pushNotification } = useApp();
    const [conversations, setConversations] = useState([]);
    const [activeUserId, setActiveUserId] = useState(initialUserId);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [search, setSearch] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionIndex, setMentionIndex] = useState(0);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const pollRef = useRef(null);

    // Filtered team members for @mention autocomplete
    const mentionMatches = teamMembers.filter(m =>
        m.name.toLowerCase().includes(mentionQuery.toLowerCase()) && m.name
    ).slice(0, 5);

    const loadConversations = useCallback(async () => {
        try {
            const data = await fetchConversations();
            setConversations(data);
        } catch { }
    }, []);

    const loadMessages = useCallback(async (userId) => {
        if (!userId) return;
        try {
            const data = await fetchConversation(userId);
            setMessages(data);
            await markMessagesReadApi(userId);
            // Refresh conversations to clear unread badge
            loadConversations();
        } catch { }
    }, [loadConversations]);

    // Open to a specific user when initialUserId changes
    useEffect(() => {
        if (initialUserId) setActiveUserId(initialUserId);
    }, [initialUserId]);

    // Load conversations + poll when drawer opens
    useEffect(() => {
        if (!isOpen) { clearInterval(pollRef.current); return; }
        loadConversations();
        pollRef.current = setInterval(loadConversations, 10000);
        return () => clearInterval(pollRef.current);
    }, [isOpen, loadConversations]);

    // Load & poll messages when a conversation is selected
    useEffect(() => {
        if (!activeUserId || !isOpen) return;
        loadMessages(activeUserId);
        const id = setInterval(() => loadMessages(activeUserId), 5000);
        return () => clearInterval(id);
    }, [activeUserId, isOpen, loadMessages]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInput(val);
        // Detect @mention trigger
        const cursor = e.target.selectionStart;
        const before = val.slice(0, cursor);
        const match = before.match(/@(\w*)$/);
        if (match) {
            setMentionQuery(match[1]);
            setShowMentions(true);
            setMentionIndex(0);
        } else {
            setShowMentions(false);
        }
    };

    const insertMention = (member) => {
        const cursor = inputRef.current?.selectionStart || input.length;
        const before = input.slice(0, cursor);
        const after = input.slice(cursor);
        const replaced = before.replace(/@\w*$/, `@${member.name} `);
        setInput(replaced + after);
        setShowMentions(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (showMentions) {
            if (e.key === 'ArrowDown') { e.preventDefault(); setMentionIndex(i => Math.min(i + 1, mentionMatches.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setMentionIndex(i => Math.max(i - 1, 0)); }
            if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); if (mentionMatches[mentionIndex]) insertMention(mentionMatches[mentionIndex]); return; }
            if (e.key === 'Escape') { setShowMentions(false); return; }
        }
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const handleSend = async () => {
        if (!input.trim() || !activeUserId || sending) return;
        setSending(true);
        const content = input.trim();
        const getTargetId = (m) => {
            if (!m) return null;
            if (m.linkedUser?.id || m.linkedUser?._id) return String(m.linkedUser.id || m.linkedUser._id);
            if (typeof m.linkedUser === 'string') return m.linkedUser;
            return String(m._id || m.id);
        };
        const isEditing = !!editingMessageId;
        const receiverId = activeContact ? getTargetId(activeContact) : String(activeUserId);

        try {
            if (isEditing) {
                const updatedMsg = await editMessageApi(editingMessageId, content);
                setMessages(prev => prev.map(m => m._id === editingMessageId ? updatedMsg : m));
                setEditingMessageId(null);
            } else {
                const newMsg = await sendMessageApi(receiverId || activeUserId, content);
                setMessages(prev => [...prev, newMsg]);

                if (newMsg.mentions?.length > 0) {
                    pushNotification({
                        id: `mention-msg-${newMsg._id}`,
                        type: 'mention',
                        title: 'You were mentioned',
                        message: `${currentUser?.name} mentioned someone in a message`,
                        time: 'Just now',
                        read: false
                    });
                }
            }
            setInput('');
            setShowMentions(false);
            loadConversations();
        } catch (err) {
            if (!isEditing) setInput(content);
            pushNotification({
                id: `err-msg-${Date.now()}`,
                type: 'error',
                title: isEditing ? 'Could not update message' : 'Could not send message',
                message: err.message || 'Please try again.',
                read: false
            });
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (msgId) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            await deleteMessageApi(msgId);
            setMessages(prev => prev.filter(m => m._id !== msgId));
            if (editingMessageId === msgId) {
                setEditingMessageId(null);
                setInput('');
            }
            loadConversations();
        } catch (err) {
            pushNotification({
                id: `err-del-${Date.now()}`,
                type: 'error',
                title: 'Could not delete message',
                message: err.message || 'Please try again.',
                read: false
            });
        }
    };

    const startEditMessage = (msgId, currentContent) => {
        setEditingMessageId(msgId);
        setInput(currentContent);
        inputRef.current?.focus();
    };

    const getStrId = (u) => String(u?._id || u?.id);
    const activeContact = conversations.find(c => getStrId(c.user) === String(activeUserId))?.user
        || teamMembers.find(m => {
            const mId = m.linkedUser?.id || m.linkedUser?._id || m.linkedUser || m._id || m.id;
            return String(mId) === String(activeUserId) || String(m._id || m.id) === String(activeUserId);
        });

    const filteredConversations = conversations.filter(c =>
        c.user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (!isOpen) return null;

    const myId = currentUser?.id || currentUser?._id;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)'
                }}
            />

            {/* Drawer */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '680px', maxWidth: '95vw',
                zIndex: 1001,
                display: 'flex',
                background: 'var(--color-bg-secondary)',
                borderLeft: '1px solid var(--color-border)',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
                animation: 'slideInRight 0.25s ease'
            }}>

                {/* ── LEFT: Conversation List ── */}
                <div style={{
                    width: '240px', flexShrink: 0,
                    borderRight: '1px solid var(--color-border)',
                    display: 'flex', flexDirection: 'column',
                    background: 'var(--color-bg-primary)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1rem', borderBottom: '1px solid var(--color-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <h3 className="font-bold" style={{ fontSize: '15px' }}>Messages</h3>
                        <button onClick={onClose} className="btn btn-ghost btn-icon-sm">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Search */}
                    <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{
                                position: 'absolute', left: '10px', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--color-text-muted)'
                            }} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search conversations..."
                                style={{
                                    width: '100%', padding: '0.4rem 0.5rem 0.4rem 2rem',
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '8px', color: 'inherit', fontSize: '13px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Conversation list + team members */}
                    <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">

                        {/* Past conversations (everyone sees these) */}
                        {filteredConversations.length > 0 && (
                            <>
                                {conversations.length > 0 && (
                                    <p style={{ padding: '0.5rem 1rem 0.25rem', fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conversations</p>
                                )}
                                {filteredConversations.map(conv => (
                                    <div
                                        key={conv.user?._id}
                                        onClick={() => setActiveUserId(conv.user?._id)}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            cursor: 'pointer',
                                            background: activeUserId === conv.user?._id ? 'var(--color-bg-secondary)' : 'transparent',
                                            borderLeft: activeUserId === conv.user?._id ? '2px solid var(--color-electric-blue)' : '2px solid transparent',
                                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                            <img src={conv.user?.avatar || 'https://i.pravatar.cc/40'} alt={conv.user?.name}
                                                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                                            {conv.unread > 0 && (
                                                <span style={{
                                                    position: 'absolute', top: -2, right: -2,
                                                    background: 'var(--color-priority-high)',
                                                    borderRadius: '50%', width: 14, height: 14,
                                                    fontSize: 9, display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', fontWeight: 700, color: '#fff'
                                                }}>{conv.unread > 9 ? '9+' : conv.unread}</span>
                                            )}
                                        </div>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <p style={{ fontSize: 13, fontWeight: conv.unread > 0 ? 700 : 500, marginBottom: 2 }}
                                                className="truncate">{conv.user?.name}</p>
                                            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {conv.lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Admin: show ALL team members they haven't chatted with yet */}
                        {currentUser?.userRole === 'admin' && (() => {
                            const chattedIds = new Set(conversations.map(c => String(c.user?._id || c.user?.id)));
                            const unchattedMembers = teamMembers.filter(m => {
                                const mId = m.linkedUser?.id || m.linkedUser?._id || m.linkedUser || m._id || m.id;
                                const stringId = String(mId);
                                return !chattedIds.has(stringId) && stringId !== String(currentUser?.id || currentUser?._id);
                            }).filter(m => m.name?.toLowerCase().includes(search.toLowerCase()));
                            if (unchattedMembers.length === 0) return null;
                            return (
                                <div>
                                    <p style={{ padding: '0.5rem 1rem 0.25rem', fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>All Team Members</p>
                                    {unchattedMembers.map(m => {
                                        const targetIdObj = m.linkedUser?.id || m.linkedUser?._id || m.linkedUser || m._id || m.id;
                                        const targetId = String(targetIdObj);
                                        const isPending = m.status === 'pending';
                                        return (
                                            <div key={m.id || m._id}
                                                onClick={() => !isPending && setActiveUserId(targetId)}
                                                title={isPending ? "Waiting for member to join" : ""}
                                                style={{
                                                    padding: '0.6rem 1rem', display: 'flex', alignItems: 'center',
                                                    gap: '0.6rem', cursor: isPending ? 'not-allowed' : 'pointer',
                                                    opacity: isPending ? 0.6 : 1,
                                                    borderLeft: activeUserId === targetId ? '2px solid var(--color-electric-blue)' : '2px solid transparent',
                                                    background: activeUserId === targetId ? 'var(--color-bg-secondary)' : 'transparent',
                                                    transition: 'all 0.15s'
                                                }}>
                                                <img src={m.avatar} alt={m.name} style={{ width: 34, height: 34, borderRadius: '50%' }} />
                                                <div style={{ minWidth: 0, flex: 1 }}>
                                                    <p style={{ fontSize: 13, fontWeight: 500 }} className="truncate">
                                                        {m.name} {isPending && <span style={{ fontSize: 10, color: 'var(--color-warning)', marginLeft: '4px' }}>(Pending)</span>}
                                                    </p>
                                                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{m.role}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}

                        {/* Non-admin: show empty state if no conversations */}
                        {currentUser?.userRole !== 'admin' && conversations.length === 0 && (
                            <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                <MessageSquare size={32} style={{ opacity: 0.2, margin: '0 auto 0.5rem' }} />
                                <p style={{ fontSize: 13, fontWeight: 600 }}>No messages yet</p>
                                <p style={{ fontSize: 11, marginTop: '0.25rem', lineHeight: 1.5 }}>
                                    Go to the <strong>Team</strong> page and click the 💬 button on a member to start a conversation.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT: Chat Window ── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    {activeUserId && activeContact ? (
                        <>
                            {/* Chat Header */}
                            <div style={{
                                padding: '1rem 1.25rem',
                                borderBottom: '1px solid var(--color-border)',
                                display: 'flex', alignItems: 'center', gap: '0.75rem'
                            }}>
                                <img src={activeContact.avatar || 'https://i.pravatar.cc/40'} alt={activeContact.name}
                                    style={{ width: 36, height: 36, borderRadius: '50%' }} />
                                <div>
                                    <p className="font-bold" style={{ fontSize: 14 }}>{activeContact.name}</p>
                                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{activeContact.role || activeContact.email}</p>
                                </div>
                            </div>

                            {/* Messages */}
                            {/* Messages */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} className="custom-scrollbar">
                                {messages.length === 0 ? (
                                    <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        <MessageSquare size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                                        <p style={{ fontSize: 13 }}>Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map(msg => {
                                        const isMe = String(msg.sender?._id || msg.sender) === String(myId);
                                        return (
                                            <div key={msg._id}
                                                onMouseEnter={() => setHoveredMessageId(msg._id)}
                                                onMouseLeave={() => setHoveredMessageId(null)}
                                                style={{
                                                    display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row',
                                                    alignItems: 'flex-end', gap: '0.4rem'
                                                }}>
                                                {!isMe && (
                                                    <img src={msg.sender?.avatar || 'https://i.pravatar.cc/32'} alt=""
                                                        style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
                                                )}

                                                <div style={{
                                                    maxWidth: '70%',
                                                    padding: '0.5rem 0.85rem',
                                                    borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                    background: isMe
                                                        ? 'linear-gradient(135deg, #667eea, #764ba2)'
                                                        : 'var(--color-bg-primary)',
                                                    border: isMe ? 'none' : '1px solid var(--color-border)',
                                                    fontSize: 13, lineHeight: 1.5,
                                                    wordBreak: 'break-word',
                                                    color: isMe ? '#ffffff' : 'var(--color-text-primary)',
                                                    position: 'relative'
                                                }}>
                                                    {/* Edit/Delete inside bubble for my messages - always visible on hover, good hit area */}
                                                    {isMe && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: 4,
                                                            right: 4,
                                                            display: 'flex',
                                                            gap: 2,
                                                            opacity: hoveredMessageId === msg._id ? 1 : 0.4,
                                                            zIndex: 2,
                                                            pointerEvents: 'auto'
                                                        }}>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); startEditMessage(msg._id, msg.content); }}
                                                                className="btn btn-secondary"
                                                                style={{ minWidth: 28, minHeight: 28, padding: '0 4px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                                title="Edit message"
                                                            >
                                                                <Edit2 size={12} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
                                                                className="btn btn-danger"
                                                                style={{ minWidth: 28, minHeight: 28, padding: '0 4px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                                title="Delete message"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <div style={{ paddingRight: isMe ? 56 : 0 }}>
                                                        {msg.content.split(/(@\w+)/g).map((part, i) =>
                                                            part.startsWith('@')
                                                                ? <strong key={i} style={{ color: isMe ? '#c4b5fd' : 'var(--color-electric-violet)' }}>{part}</strong>
                                                                : part
                                                        )}
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: '0.3rem', marginTop: '0.2rem' }}>
                                                            <p style={{ fontSize: 10, color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)' }}>
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                            {msg.isEdited && (
                                                                <span style={{ fontSize: 9, color: isMe ? 'rgba(255,255,255,0.6)' : 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                                                    (edited)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* Input */}
                            <div style={{
                                padding: '0.75rem 1rem',
                                borderTop: '1px solid var(--color-border)',
                                position: 'relative'
                            }}>
                                {/* @Mention Autocomplete */}
                                {showMentions && mentionMatches.length > 0 && (
                                    <div style={{
                                        position: 'absolute', bottom: '100%', left: '1rem', right: '1rem',
                                        background: 'var(--color-bg-primary)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '8px', overflow: 'hidden',
                                        boxShadow: '0 -8px 24px rgba(0,0,0,0.3)',
                                        zIndex: 10
                                    }}>
                                        {mentionMatches.map((m, i) => (
                                            <div key={m.id || m._id}
                                                onClick={() => insertMention(m)}
                                                style={{
                                                    padding: '0.5rem 0.75rem',
                                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                    cursor: 'pointer',
                                                    background: i === mentionIndex ? 'rgba(102,126,234,0.15)' : 'transparent',
                                                    fontSize: 13
                                                }}>
                                                <img src={m.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                                                <span>{m.name}</span>
                                                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{m.role}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder={editingMessageId ? "Edit your message... (type @ to mention)" : `Message ${activeContact?.name}… (type @ to mention)`}
                                        rows={1}
                                        style={{
                                            flex: 1, resize: 'none', minHeight: 40, maxHeight: 120,
                                            padding: '0.6rem 0.85rem',
                                            background: editingMessageId ? 'rgba(0, 212, 255, 0.05)' : 'var(--color-bg-primary)',
                                            border: editingMessageId ? '1px solid var(--color-electric-blue)' : '1px solid var(--color-border)',
                                            borderRadius: '12px', color: 'inherit', fontSize: 13,
                                            lineHeight: 1.5, outline: 'none', overflowY: 'auto'
                                        }}
                                    />
                                    {editingMessageId && (
                                        <button
                                            onClick={() => { setEditingMessageId(null); setInput(''); }}
                                            className="btn btn-ghost"
                                            style={{ padding: '0.5rem 0.75rem', borderRadius: '12px', flexShrink: 0, color: 'var(--color-text-muted)' }}
                                            title="Cancel edit"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleSend}
                                        disabled={!input.trim() || sending}
                                        className="btn btn-primary"
                                        style={{ padding: '0.5rem 0.75rem', borderRadius: '12px', flexShrink: 0, minHeight: 40 }}
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                    Enter to send · Shift+Enter for new line · @ to mention
                                </p>
                            </div>
                        </>
                    ) : (
                        /* Empty state */
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
                            <MessageSquare size={56} style={{ opacity: 0.2 }} />
                            <p style={{ fontWeight: 600 }}>Select a conversation</p>
                            <p style={{ fontSize: 13 }}>Choose someone from the left to start chatting</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default MessagesDrawer;
