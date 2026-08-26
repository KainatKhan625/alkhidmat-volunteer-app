import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import { OnboardingProvider } from "./src/context/onboardingcontext";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <RootNavigator />
      </OnboardingProvider>
    </AuthProvider>
  );
}