import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminEventsStack from "./AdminEventsStack";
import VolunteersListScreen from "../screens/admin/VolunteersListScreen";
import AdminProfileStack from "./AdminProfileStack";

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2E5395",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Dashboard") iconName = "grid-outline";
          else if (route.name === "Events") iconName = "calendar-outline";
          else if (route.name === "Volunteers") iconName = "people-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Events" component={AdminEventsStack} />
      <Tab.Screen name="Volunteers" component={VolunteersListScreen} />
      <Tab.Screen name="Profile" component={AdminProfileStack} />
    </Tab.Navigator>
  );
}