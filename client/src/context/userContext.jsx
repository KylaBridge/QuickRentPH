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
      throw error.response.data.error || "Profile update failed";
    }
  };

  // Fetch all items
  const getAllItems = async () => {
    try {
      const res = await api.get("/api/items/all");
      return res.data.items || [];
    } catch (error) {
      throw error.response?.data?.error || "Failed to fetch items";
    }
  };

  // Fetch all items owned by the current user
  const getUserItems = async () => {
    try {
      const res = await api.get("/api/items");
      return res.data.items || [];
    } catch (error) {
      throw error.response?.data?.error || "Failed to fetch items";
    }
  };

  const buildItemFormData = (item) => {
    const formData = new FormData();
    Object.keys(item).forEach((key) => {
      if (key !== "images" && item[key] !== undefined && item[key] !== null) {
        // Handle arrays properly by appending each element
        if (Array.isArray(item[key])) {
          item[key].forEach((value) => formData.append(key, value));
        } else {
          formData.append(key, item[key]);
        }
      }
    });
    if (item.images && Array.isArray(item.images)) {
      item.images.forEach((file) => formData.append("images", file));
    }
    return formData;
  };

  // Create an item
  const addItem = async (newItem) => {
    try {
      const res = await api.post(
        "/api/items",
        buildItemFormData(newItem),
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data.item;
    } catch (error) {
      throw error.response.data.error || "Add item failed";
    }
  };

  // Update an existing item
  const updateItem = async (id, updates) => {
    try {
      const res = await api.put(
        `/api/items/${id}`,
        buildItemFormData(updates),
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data.item;
    } catch (error) {
      throw error.response.data.error || "Update item failed";
    }
  };

  // Delete an item
  const deleteItem = async (itemId) => {
    try {
      const res = await api.delete(`/api/items/${itemId}`);
      return res.data;
    } catch (error) {
      throw error.response.data.error || "Delete item failed";
    }
  };

  return (
    <UserContext.Provider
      value={{
        changeProfile,
        getAllItems,
        getUserItems,
        addItem,
        updateItem,
        deleteItem,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
