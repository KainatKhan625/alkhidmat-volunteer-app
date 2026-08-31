import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (err) {
        console.log("Error loading stored user:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (token, userData) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

    const logout = async () => {
    console.log("Logout button pressed");
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      setUser(null);
      console.log("Logout successful");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const updateUser = async (updatedFields) => {
    const newUser = { ...user, ...updatedFields };
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);