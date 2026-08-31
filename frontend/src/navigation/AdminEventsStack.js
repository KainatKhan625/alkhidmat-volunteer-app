import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminEventListScreen from "../screens/admin/AdminEventListScreen";
import CreateEventScreen from "../screens/admin/CreateEventScreen";
import AdminFeedbackScreen from "../screens/admin/AdminFeedbackScreen";
import EditEventScreen from "../screens/admin/EditEventScreen";
import EventAttendanceScreen from "../screens/admin/EventAttendanceScreen";

const Stack = createNativeStackNavigator();

export default function AdminEventsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminEventList" component={AdminEventListScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="AdminFeedback" component={AdminFeedbackScreen} />
      <Stack.Screen name="EditEvent" component={EditEventScreen} />
      <Stack.Screen name="EventAttendance" component={EventAttendanceScreen} />
    </Stack.Navigator>
  );
}