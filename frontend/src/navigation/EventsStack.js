import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EventListScreen from "../screens/volunteer/EventListScreen";
import EventDetailScreen from "../screens/volunteer/EventDetailScreen";
import RegistrationFormScreen from "../screens/volunteer/RegistrationFormScreen";

const Stack = createNativeStackNavigator();

export default function EventsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventList" component={EventListScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="RegistrationForm" component={RegistrationFormScreen} />
    </Stack.Navigator>
  );
}