import { createContext } from "react";
import api from "../axios";

export const AdminUserContext = createContext();

export function AdminUserProvider({ children }) {
  // Delete user by ID
  const deleteUser = async (userId) => {
    try {
      const res = await api.delete(`/api/admin/user/${userId}`);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to delete user.";
    }
  };

  // Get all users
  const getAllUsers = async () => {
    try {
      const res = await api.get("/api/admin/user");
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch users.";
    }
  };

  return (
    <AdminUserContext.Provider value={{ deleteUser, getAllUsers }}>
      {children}
    </AdminUserContext.Provider>
  );
}
