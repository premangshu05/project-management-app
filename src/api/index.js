// Central API helper — automatically attaches JWT token to every request

const BASE_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("projexis_token");

const headers = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerUser = (name, email, password) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name, email, password }),
  }).then(handleResponse);

export const loginUser = (email, password) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);

export const getMe = () =>
  fetch(`${BASE_URL}/auth/me`, { headers: headers() }).then(handleResponse);

export const updateProfile = (data) =>
  fetch(`${BASE_URL}/auth/profile`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updatePasswordApi = (data) =>
  fetch(`${BASE_URL}/auth/password`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const acceptInvite = (token, password) =>
  fetch(`${BASE_URL}/auth/accept-invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  }).then(handleResponse);

export const forgotPasswordApi = (email) =>
  fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then(handleResponse);

export const resetPasswordApi = (token, password) =>
  fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  }).then(handleResponse);

// ─── Projects ─────────────────────────────────────────────────────────────────

export const fetchProjects = () =>
  fetch(`${BASE_URL}/projects`, { headers: headers() }).then(handleResponse);

export const createProject = (data) =>
  fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateProjectApi = (id, data) =>
  fetch(`${BASE_URL}/projects/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteProjectApi = (id) =>
  fetch(`${BASE_URL}/projects/${id}`, {
    method: "DELETE",
    headers: headers(),
  }).then(handleResponse);

export const toggleSubtaskApi = (projectId, taskId, subtaskId) =>
  fetch(
    `${BASE_URL}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/toggle`,
    {
      method: "PATCH",
      headers: headers(),
    },
  ).then(handleResponse);

// ─── Team ────────────────────────────────────────────────────────────────────

export const fetchTeam = () =>
  fetch(`${BASE_URL}/team`, { headers: headers() }).then(handleResponse);

export const createTeamMember = (data) =>
  fetch(`${BASE_URL}/team`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateTeamMemberApi = (id, data) =>
  fetch(`${BASE_URL}/team/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteTeamMemberApi = (id) =>
  fetch(`${BASE_URL}/team/${id}`, {
    method: "DELETE",
    headers: headers(),
  }).then(handleResponse);

export const promoteTeamMemberApi = (id) =>
  fetch(`${BASE_URL}/team/${id}/promote`, {
    method: "PATCH",
    headers: headers(),
  }).then(handleResponse);

export const resendInviteApi = (id) =>
  fetch(`${BASE_URL}/team/resend-invite/${id}`, {
    method: "POST",
    headers: headers(),
  }).then(handleResponse);

// ─── Messages ─────────────────────────────────────────────────────────────────

export const fetchConversations = () =>
  fetch(`${BASE_URL}/messages/conversations`, { headers: headers() }).then(
    handleResponse,
  );

export const fetchConversation = (userId) =>
  fetch(`${BASE_URL}/messages/${userId}`, { headers: headers() }).then(
    handleResponse,
  );

export const sendMessageApi = (receiverId, content) =>
  fetch(`${BASE_URL}/messages`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ receiverId, content }),
  }).then(handleResponse);

export const markMessagesReadApi = (senderId) =>
  fetch(`${BASE_URL}/messages/read/${senderId}`, {
    method: "PATCH",
    headers: headers(),
  }).then(handleResponse);

export const fetchUnreadMessageCount = () =>
  fetch(`${BASE_URL}/messages/unread-count`, { headers: headers() }).then(
    handleResponse,
  );

export const fetchUnreadMentions = () =>
  fetch(`${BASE_URL}/messages/mentions`, { headers: headers() }).then(
    handleResponse,
  );

export const editMessageApi = (id, content) =>
  fetch(`${BASE_URL}/messages/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ content }),
  }).then(handleResponse);

export const deleteMessageApi = (id) =>
  fetch(`${BASE_URL}/messages/${id}`, {
    method: "DELETE",
    headers: headers(),
  }).then(handleResponse);
