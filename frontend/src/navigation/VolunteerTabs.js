import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import EventsStack from "./EventsStack";
import MyRegistrationsScreen from "../screens/volunteer/MyRegistrationsScreen";
import LeaderboardScreen from "../screens/volunteer/LeaderboardScreen";
import ProfileScreen from "../screens/volunteer/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function VolunteerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2E5395",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Events") iconName = "calendar-outline";
          else if (route.name === "My Registrations") iconName = "list-outline";
          else if (route.name === "Leaderboard") iconName = "trophy-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Events" component={EventsStack} />
      <Tab.Screen name="My Registrations" component={MyRegistrationsScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}