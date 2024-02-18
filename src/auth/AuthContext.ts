import { createContext } from "react";

// Authorization context, client representation of session variables
interface iAuthContext {
  userPK?: number | null;
  userEmail?: string;
  userFirstName?: string;
  userLastName?: string;
  userDisplayName?: string;
  saveToken: (token: string) => void;
  getToken: () => string | null;
  logout: () => void;
}

const saveToken = (token: string) => {
  // Save token to local storage
  window.localStorage.setItem("token", token);
};

const getToken = (): string | null => {
  // Get token from local storage
  return window.localStorage.getItem("token");
};

const logout = () => {
  // Remove token from local storage
  return window.localStorage.removeItem("token");
};

export const AuthContext = createContext<iAuthContext>({
  saveToken: saveToken,
  getToken: getToken,
  logout: logout,
});
