import React, { createContext, useState, useEffect } from "react";
import { fetchMe, getToken, loginRequest, register, setToken } from "../api/auth";

export const AuthContext = createContext();

const toUser = (data) => ({
  email: data.email,
  displayName: data.displayName || data.email.split("@")[0],
  role: data.role,
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyAuth = (data) => {
    if (data.token) {
      setToken(data.token);
    }
    const nextUser = toUser(data);
    setUser(nextUser);
    setRole(data.role);
    return { ...nextUser, role: data.role };
  };

  const createUser = async (email, password) => {
    return register(email, password);
  };

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    return applyAuth(data);
  };

  const logOut = async () => {
    setToken(null);
    setUser(null);
    setRole(null);
  };

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then((data) => applyAuth(data))
      .catch(() => {
        setToken(null);
        setUser(null);
        setRole(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const authInfo = {
    createUser,
    user,
    role,
    logOut,
    loading,
    login,
    isAdmin: role === "admin",
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
