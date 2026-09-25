import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  registerForPushNotificationsAsync,
  savePushTokenToBackend,
} from "../services/notificationService";

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

    // Register for push notifications after login
    console.log("LOGIN: about to call registerForPushNotificationsAsync");
    try {
      const pushToken = await registerForPushNotificationsAsync();
      console.log("LOGIN: pushToken received:", pushToken);
      if (pushToken) {
        await savePushTokenToBackend(pushToken);
      }
    } catch (err) {
      console.log("Error setting up push notifications:", err);
    }
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