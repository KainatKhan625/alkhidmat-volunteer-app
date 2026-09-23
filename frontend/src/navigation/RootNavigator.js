import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import VolunteerTabs from "./VolunteerTabs";
import AdminTabs from "./AdminTabs";
import SplashScreen from "../screens/SplashScreen";
import OnboardingScreen from "../screens/OnboardingScreen";

const Stack = createNativeStackNavigator();
const ONBOARDING_KEY = "hasSeenOnboarding";

export default function RootNavigator() {
  const { user, isLoading } = useAuth();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2500); // splash screen kam se kam 2.5 seconds dikhegi
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasSeenOnboarding(value === "true");
    };
    checkOnboarding();
  }, []);

  const handleOnboardingDone = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setHasSeenOnboarding(true);
  };

  // Splash screen tab tak dikhegi jab tak auth-check, min-time, aur onboarding-check teeno complete na ho
  if (isLoading || !minTimeElapsed || hasSeenOnboarding === null) {
    return <SplashScreen />;
  }

  if (!hasSeenOnboarding) {
    return <OnboardingScreen onDone={handleOnboardingDone} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen
            name="Home"
            component={user?.role === "ADMIN" ? AdminTabs : VolunteerTabs}
          />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}