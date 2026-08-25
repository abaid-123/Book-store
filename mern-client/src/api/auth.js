import { API_URL } from "./config";

const API = API_URL;
const TOKEN_KEY = "bookstore-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function authFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export function register(email, password) {
  return authFetch("/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function loginRequest(email, password) {
  return authFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMe() {
  return authFetch("/me");
}

export function deleteReview(id) {
  return authFetch(`/delete-review/${id}`, { method: "DELETE" });
}

export function fetchUsers() {
  return authFetch("/all-users");
}

export function deleteUser(id) {
  return authFetch(`/delete-user/${id}`, { method: "DELETE" });
}

export function changePassword(currentPassword, newPassword) {
  return authFetch("/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
