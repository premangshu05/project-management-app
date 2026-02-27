import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  calculateProjectProgress,
  calculateTaskProgress,
} from "../utils/progressCalculator";
import {
  loginUser,
  registerUser,
  getMe,
  fetchProjects,
  fetchTeam,
  createProject,
  updateProjectApi,
  deleteProjectApi,
  toggleSubtaskApi,
  createTeamMember,
  updateTeamMemberApi,
  deleteTeamMemberApi,
  updateProfile,
  fetchUnreadMessageCount,
  fetchUnreadMentions,
} from "../api";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

// Normalize MongoDB _id → id so all existing UI code keeps working
const normalizeId = (obj) => {
  if (!obj) return obj;
  const normalized = { ...obj };
  if (normalized._id && !normalized.id) {
    normalized.id =
      typeof normalized._id === "object"
        ? normalized._id.toString()
        : normalized._id;
  }
  // Normalize nested tasks and subtasks
  if (normalized.tasks) {
    normalized.tasks = normalized.tasks.map((task) => {
      const t = { ...task };
      if (t._id && !t.id) t.id = t._id.toString ? t._id.toString() : t._id;
      if (t.subtasks) {
        t.subtasks = t.subtasks.map((sub) => {
          const s = { ...sub };
          if (s._id && !s.id) s.id = s._id.toString ? s._id.toString() : s._id;
          return s;
        });
      }
      return t;
    });
  }
  // Normalize populated assignedTeam members
  if (normalized.assignedTeam) {
    normalized.assignedTeam = normalized.assignedTeam.map((m) => {
      if (!m || typeof m !== "object") return m;
      const nm = { ...m };
      if (nm._id && !nm.id)
        nm.id = nm._id.toString ? nm._id.toString() : nm._id;
      return nm;
    });
  }
  return normalized;
};

// ─── Notification helpers ─────────────────────────────────────────────────────

// Load persisted notifications from localStorage (scoped per user email)
const loadStoredNotifications = (userEmail) => {
  try {
    const raw = localStorage.getItem(`projexis_notifs_${userEmail}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveNotifications = (userEmail, notifs) => {
  try {
    localStorage.setItem(
      `projexis_notifs_${userEmail}`,
      JSON.stringify(notifs),
    );
  } catch {}
};

// Generate notifications from current project state
const generateProjectNotifications = (projects) => {
  const notifs = [];
  const now = new Date();

  projects.forEach((project) => {
    // ── Deadline alerts ──────────────────────────────────────
    if (project.endDate && project.status !== "Completed") {
      const end = new Date(project.endDate);
      const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      if (daysLeft < 0) {
        notifs.push({
          id: `deadline-overdue-${project.id}`,
          type: "deadline",
          title: "Project Overdue",
          message: `"${project.name}" passed its deadline ${Math.abs(daysLeft)} day(s) ago`,
          time: "Overdue",
          read: false,
          priority: 1,
        });
      } else if (daysLeft <= 3) {
        notifs.push({
          id: `deadline-soon-${project.id}`,
          type: "deadline",
          title: "Deadline Soon",
          message: `"${project.name}" is due in ${daysLeft} day(s)`,
          time: `${daysLeft}d left`,
          read: false,
          priority: 2,
        });
      } else if (daysLeft <= 7) {
        notifs.push({
          id: `deadline-week-${project.id}`,
          type: "deadline",
          title: "Deadline This Week",
          message: `"${project.name}" is due in ${daysLeft} days`,
          time: `${daysLeft}d left`,
          read: false,
          priority: 3,
        });
      }
    }

    // ── Completed project ────────────────────────────────────
    if (project.status === "Completed") {
      notifs.push({
        id: `completed-${project.id}`,
        type: "task",
        title: "Project Completed 🎉",
        message: `"${project.name}" has been marked as completed`,
        time: "Recently",
        read: false,
        priority: 4,
      });
    }

    // ── Subtask progress ─────────────────────────────────────
    const allSubtasks = (project.tasks || []).flatMap((t) => t.subtasks || []);
    const doneSubtasks = allSubtasks.filter((s) => s.completed).length;
    if (
      allSubtasks.length > 0 &&
      doneSubtasks === allSubtasks.length &&
      project.status !== "Completed"
    ) {
      notifs.push({
        id: `alltasks-done-${project.id}`,
        type: "task",
        title: "All Tasks Done",
        message: `All subtasks in "${project.name}" are complete`,
        time: "Just now",
        read: false,
        priority: 4,
      });
    }
  });

  return notifs.sort((a, b) => a.priority - b.priority);
};

export const AppProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [teamMembersState, setTeamMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTargetUserId, setChatTargetUserId] = useState(null);

  const openChat = useCallback((userId = null) => {
    setChatTargetUserId(userId);
    setChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setChatOpen(false);
    setChatTargetUserId(null);
  }, []);

  // Push a one-off notification (e.g. from user actions)
  const pushNotification = useCallback(
    (notif) => {
      setNotifications((prev) => {
        // Avoid exact duplicate ids
        if (prev.some((n) => n.id === notif.id)) return prev;
        const updated = [notif, ...prev].slice(0, 50); // cap at 50
        if (currentUser?.email) saveNotifications(currentUser.email, updated);
        return updated;
      });
    },
    [currentUser],
  );

  // Rebuild project-derived notifications whenever projects change
  useEffect(() => {
    if (!isAuthenticated || projects.length === 0) return;
    const projectNotifs = generateProjectNotifications(projects);
    setNotifications((prev) => {
      // Keep manual/action notifications (those not generated from projects)
      const manual = prev.filter(
        (n) =>
          !n.id.startsWith("deadline-") &&
          !n.id.startsWith("completed-") &&
          !n.id.startsWith("alltasks-done-") &&
          !n.id.startsWith("team-member-"),
      );
      // Merge: preserve read state for existing project notifs
      const merged = projectNotifs.map((pn) => {
        const existing = prev.find((e) => e.id === pn.id);
        return existing ? { ...pn, read: existing.read } : pn;
      });
      const updated = [...merged, ...manual].slice(0, 50);
      if (currentUser?.email) saveNotifications(currentUser.email, updated);
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, isAuthenticated]);

  // Poll unread message count every 15s while authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const poll = async () => {
      try {
        const { count } = await fetchUnreadMessageCount();
        setUnreadMessagesCount(count);

        // Fetch unread mentions to push system notifications
        const mentions = await fetchUnreadMentions();
        mentions.forEach((msg) => {
          const senderName = msg.sender?.name || "Someone";
          pushNotification({
            id: `mention-msg-${msg._id}`,
            type: "mention",
            title: "You were mentioned",
            message: `${senderName} mentioned you in a message`,
            time: "Just now", // Could be mapped from msg.createdAt
            read: false,
            priority: 1,
          });
        });
      } catch {}
    };
    poll();
    const id = setInterval(poll, 15000);
    return () => clearInterval(id);
  }, [isAuthenticated, pushNotification]);

  // Load projects and team from API
  const loadAppData = async () => {
    try {
      const [projectsData, teamData] = await Promise.all([
        fetchProjects(),
        fetchTeam(),
      ]);
      setProjects(projectsData.map(normalizeId));
      setTeamMembers(teamData.map(normalizeId));
    } catch (err) {
      console.error("Failed to load app data:", err.message);
    }
  };

  // On mount: restore session and load persisted notifications
  useEffect(() => {
    const token = localStorage.getItem("projexis_token");
    const savedUser = localStorage.getItem("projexis_user");
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        // Restore persisted notifications for this user
        const stored = loadStoredNotifications(user.email);
        if (stored) setNotifications(stored);
        loadAppData();
      } catch {
        localStorage.removeItem("projexis_token");
        localStorage.removeItem("projexis_user");
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login — real API call, then load data from DB
  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem("projexis_token", data.token);
    localStorage.setItem("projexis_user", JSON.stringify(data.user));
    setCurrentUser(data.user);
    setIsAuthenticated(true);
    // Restore persisted notifications for this user
    const stored = loadStoredNotifications(data.user.email);
    if (stored) setNotifications(stored);
    await loadAppData();
    return data;
  };

  // Register — real API call, then load data from DB
  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    localStorage.setItem("projexis_token", data.token);
    localStorage.setItem("projexis_user", JSON.stringify(data.user));
    setCurrentUser(data.user);
    setIsAuthenticated(true);
    await loadAppData();
    return data;
  };

  // Accept invite — called by AcceptInvite page after token+password submitted
  const loginAfterInvite = async (data) => {
    localStorage.setItem("projexis_token", data.token);
    localStorage.setItem("projexis_user", JSON.stringify(data.user));
    setCurrentUser(data.user);
    setIsAuthenticated(true);
    await loadAppData();
  };

  const logout = () => {
    localStorage.removeItem("projexis_token");
    localStorage.removeItem("projexis_user");
    setCurrentUser(null);
    setIsAuthenticated(false);
    setProjects([]);
    setTeamMembers([]);
    setNotifications([]);
  };

  // ─── Project CRUD (API-backed) ─────────────────────────────────────────────

  const addProject = async (project) => {
    try {
      const newProject = await createProject(project);
      const normalized = normalizeId(newProject);
      setProjects((prev) => [normalized, ...prev]);
      return normalized;
    } catch (err) {
      console.error("Failed to create project:", err.message);
      throw err;
    }
  };

  const updateProject = async (projectId, updates) => {
    try {
      const updated = await updateProjectApi(projectId, updates);
      const normalized = normalizeId(updated);
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? normalized : p)),
      );
      return normalized;
    } catch (err) {
      console.error("Failed to update project:", err.message);
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await deleteProjectApi(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("Failed to delete project:", err.message);
      throw err;
    }
  };

  const toggleSubtask = async (projectId, taskId, subtaskId) => {
    // Optimistic UI update
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          tasks: project.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask,
              ),
            };
          }),
        };
      }),
    );

    // Persist to DB and sync project status
    try {
      const result = await toggleSubtaskApi(projectId, taskId, subtaskId);
      // Backend auto-updates project status when all subtasks complete
      if (result?.projectStatus) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, status: result.projectStatus } : p,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to toggle subtask:", err.message);
      // Revert on failure
      setProjects((prev) =>
        prev.map((project) => {
          if (project.id !== projectId) return project;
          return {
            ...project,
            tasks: project.tasks.map((task) => {
              if (task.id !== taskId) return task;
              return {
                ...task,
                subtasks: task.subtasks.map((subtask) =>
                  subtask.id === subtaskId
                    ? { ...subtask, completed: !subtask.completed }
                    : subtask,
                ),
              };
            }),
          };
        }),
      );
    }
  };

  // ─── Team Member CRUD (API-backed) ────────────────────────────────────────

  const addTeamMember = async (member) => {
    try {
      const newMember = await createTeamMember(member);
      const normalized = normalizeId(newMember);
      setTeamMembers((prev) => [...prev, normalized]);
      // Generate a notification for the new team member
      pushNotification({
        id: `team-member-${normalized.id || Date.now()}`,
        type: "assignment",
        title: "Team Member Invited",
        message: `${member.name} (${member.email}) was added to the team as ${member.role}`,
        time: "Just now",
        read: false,
      });
      return normalized;
    } catch (err) {
      console.error("Failed to add team member:", err.message);
      throw err;
    }
  };

  const updateTeamMember = async (memberId, updates) => {
    try {
      const updated = await updateTeamMemberApi(memberId, updates);
      const normalized = normalizeId(updated);
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === memberId ? normalized : m)),
      );
      return normalized;
    } catch (err) {
      console.error("Failed to update team member:", err.message);
      throw err;
    }
  };

  const deleteTeamMember = async (memberId) => {
    try {
      await deleteTeamMemberApi(memberId);
      setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      console.error("Failed to delete team member:", err.message);
      throw err;
    }
  };

  // ─── User Profile Update ──────────────────────────────────────────────────

  const updateUserProfile = async (updates) => {
    try {
      const updatedUser = await updateProfile(updates);
      const normalized = {
        ...updatedUser,
        id: updatedUser.id || updatedUser._id,
      };
      setCurrentUser(normalized);
      localStorage.setItem("projexis_user", JSON.stringify(normalized));
      return normalized;
    } catch (err) {
      console.error("Failed to update profile:", err.message);
      throw err;
    }
  };

  // ─── Notifications (in-memory) ────────────────────────────────────────────

  const markNotificationRead = (id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      if (currentUser?.email) saveNotifications(currentUser.email, updated);
      return updated;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      if (currentUser?.email) saveNotifications(currentUser.email, updated);
      return updated;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    if (currentUser?.email) saveNotifications(currentUser.email, []);
  };

  // ─── Progress calculation ─────────────────────────────────────────────────

  const getProjectWithProgress = (project) => ({
    ...project,
    progress: calculateProjectProgress(project.tasks || []),
    tasks: (project.tasks || []).map((task) => ({
      ...task,
      progress: calculateTaskProgress(task.subtasks || []),
    })),
  });

  const getProjectsWithProgress = () => projects.map(getProjectWithProgress);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    projects: getProjectsWithProgress(),
    notifications,
    unreadCount,
    theme: "dark", // Default theme to 'dark'
    currentUser,
    isAuthenticated,
    sidebarCollapsed,
    teamMembers: teamMembersState,
    loading,
    login,
    register,
    loginAfterInvite,
    logout,
    toggleSubtask,
    markNotificationRead,
    markAllNotificationsRead,
    setSidebarCollapsed,
    getProjectWithProgress,
    addProject,
    updateProject,
    deleteProject,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    updateUserProfile,
    loadAppData,
    clearAllNotifications,
    pushNotification,
    unreadMessagesCount,
    setUnreadMessagesCount,
    chatOpen,
    chatTargetUserId,
    openChat,
    closeChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
