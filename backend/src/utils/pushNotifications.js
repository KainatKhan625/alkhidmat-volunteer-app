const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

// Sends a push notification to a list of Expo push tokens.
// tokens: array of strings (Expo push tokens)
// title, body: notification content
async function sendPushNotifications(tokens, title, body, data = {}) {
  // Filter out any null/undefined tokens
  const validTokens = tokens.filter(
    (token) => token && token.startsWith("ExponentPushToken")
  );

  if (validTokens.length === 0) {
    console.log("No valid push tokens to notify");
    return;
  }

  // Expo recommends sending in batches of 100
  const messages = validTokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    data,
  }));

  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log("Push notification result:", JSON.stringify(result));
  } catch (err) {
    console.log("Error sending push notifications:", err);
  }
}

module.exports = { sendPushNotifications };