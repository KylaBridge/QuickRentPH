import { createContext, useEffect, useState } from "react";
import api from "../axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/profile");
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const registerEmail = async (email) => {
    try {
      const res = await api.post("/api/auth/register/email", { email });
      return res.data.tempToken;
    } catch (error) {
      throw error.response.data.error;
    }
  };

  const registerPassword = async (password, tempToken) => {
    try {
      const res = await api.post("/api/auth/register/password", {
        password,
        tempToken,
      });
      return res.data.newTempToken;
    } catch (error) {
      throw error.response.data.error;
    }
  };

  const registerUser = async (profileData) => {
    try {
      const res = await api.post("/api/auth/register", profileData);
      return res.data;
    } catch (error) {
      throw error.response.data.error;
    }
  };

  const loginUser = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data;
  };

  const logoutUser = async () => {
    const res = await api.post("/api/auth/logout");
    setUser(null);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        registerEmail,
        registerPassword,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
