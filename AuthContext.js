import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  const signup = (email, password, username) => {
    if (users.some((user) => user.email === email)) {
      throw new Error("این ایمیل قبلاً ثبت شده است!");
    }
    const newUser = { email, password, username };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
  };

  const login = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      throw new Error("ایمیل یا رمز عبور اشتباه است!");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const value = {
    currentUser,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
