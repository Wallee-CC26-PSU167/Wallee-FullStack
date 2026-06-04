import { createContext, useContext, useEffect, useState } from "react";
import { isTokenExpired } from "../utils/tokenUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    // Check apakah token sudah expired saat app start
    if (storedToken && isTokenExpired(storedToken)) {
      localStorage.removeItem("token");
      return null;
    }
    return storedToken || null;
  });

  const [user, setUser] = useState(null);

  const login = (tokenData, userData = null) => {
    localStorage.setItem("token", tokenData);

    setToken(tokenData);

    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  // Check token expiry setiap 60 detik
  useEffect(() => {
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        logout();
      }
    }, 60000); // Check setiap 1 menit

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        setUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};