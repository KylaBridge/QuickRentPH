import { createContext, useContext } from "react";
import api from "../axios";
import { AuthContext } from "./authContext";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const { setUser } = useContext(AuthContext);

  const changeProfile = async (profileUpdates) => {
    try {
      const res = await api.put("/api/user/profile/change", profileUpdates);
      if (res.data && res.data.user) {
        setUser(res.data.user);
      }
      return res.data.user;
    } catch (error) {
      throw error.response.data.error;
    }
  };

  const addItem = async (newItem) => {
    try {
      const formData = new FormData();

      Object.keys(newItem).forEach((key) => {
        if (key !== "images") {
          formData.append(key, newItem[key]);
        }
      });
      if (newItem.images && Array.isArray(newItem.images)) {
        newItem.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const res = await api.post("/api/rentals/addItem", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      throw error.response.data.error;
    }
  };

  return (
    <UserContext.Provider value={{ changeProfile, addItem }}>
      {children}
    </UserContext.Provider>
  );
}
