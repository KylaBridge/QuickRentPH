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

  return (
    <UserContext.Provider value={{ changeProfile }}>
      {children}
    </UserContext.Provider>
  );
}
