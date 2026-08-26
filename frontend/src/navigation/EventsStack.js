import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EventListScreen from "../screens/volunteer/EventListScreen";
import EventDetailScreen from "../screens/volunteer/EventDetailScreen";

const Stack = createNativeStackNavigator();

export default function EventsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventList" component={EventListScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  );
}