import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminProfileScreen from "../screens/admin/AdminProfileScreen";
import ChangePasswordScreen from "../screens/admin/ChangePasswordScreen";

const Stack = createNativeStackNavigator();

export default function AdminProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminProfileMain" component={AdminProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}