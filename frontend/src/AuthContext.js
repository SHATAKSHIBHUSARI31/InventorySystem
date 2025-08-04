import { createContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Renamed from signin to login
  const login = (userData, callback) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    if (callback) callback(); // optional
  };

  const signout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
