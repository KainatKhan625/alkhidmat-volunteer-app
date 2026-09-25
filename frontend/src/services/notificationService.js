import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import api from "./api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  console.log("STEP 1: registerForPushNotificationsAsync called");

  if (!Device.isDevice) {
    console.log("Push notifications only work on physical devices");
    return null;
  }

  console.log("STEP 2: is a physical device, checking permissions");

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log("STEP 3: existing permission status:", existingStatus);
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    console.log("STEP 4: requested permission, result:", status);
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Push notification permission not granted, finalStatus:", finalStatus);
    return null;
  }

  console.log("STEP 5: permission granted, getting Expo push token");

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;

  console.log("STEP 6: got token:", token);

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}

export async function savePushTokenToBackend(token) {
  try {
    await api.put("/users/push-token", { pushToken: token });
    console.log("STEP 7: push token saved to backend successfully");
  } catch (err) {
    console.log("Error saving push token:", err);
  }
}