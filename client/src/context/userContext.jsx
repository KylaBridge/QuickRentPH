import { createContext } from "react";
import api from "../axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const changeCredentials = async (a, b, c, d, e, f, g) => {
    try {
      await api.post("/profile/change", { a, b, c, d, e, f, g });
    } catch (error) {
      throw error.response.data.error;
    }
  };

  return (
    <UserContext.Provider value={changeCredentials}>
      {children}
    </UserContext.Provider>
  );
}
