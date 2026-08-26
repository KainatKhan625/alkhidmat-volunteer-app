import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useOnboarding } from "../context/onboardingcontext";

// Screen Imports
import SplashScreen from "../screens/Splash/SplashScreen";
import OnboardingScreen from "../screens/Onboarding/onboardingscreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import VolunteerTabs from "./VolunteerTabs";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, isLoading: authLoading } = useAuth();
  const { hasSeenOnboarding, isLoading: onboardingLoading } = useOnboarding();

  if (authLoading || onboardingLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        {/* Splash Screen (App Starts Here) */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Onboarding Screen */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />

        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        {/* Main Home Dashboard */}
        <Stack.Screen name="Home" component={VolunteerTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}