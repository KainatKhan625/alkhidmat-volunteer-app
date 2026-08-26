import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      {user?.profilePic ? (
        <Image source={{ uri: user.profilePic }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitial}>{user?.name?.[0]?.toUpperCase()}</Text>
        </View>
      )}

      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.meta}>{user?.email}</Text>
      <Text style={styles.meta}>{user?.city}</Text>

      <View style={styles.hoursBox}>
        <Text style={styles.hoursLabel}>Total Hours</Text>
        <Text style={styles.hoursValue}>{user?.totalHours ?? 0}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 24, paddingTop: 60, backgroundColor: "#FFFFFF" },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 16 },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#2E5395",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarInitial: { color: "#FFFFFF", fontSize: 32, fontWeight: "bold" },
  name: { fontSize: 20, fontWeight: "bold", color: "#1A1A1A" },
  meta: { fontSize: 14, color: "#6B7280", marginTop: 2 },
  hoursBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    width: "100%",
  },
  hoursLabel: { fontSize: 13, color: "#6B7280" },
  hoursValue: { fontSize: 28, fontWeight: "bold", color: "#2E5395", marginTop: 4 },
  button: {
    backgroundColor: "#DC2626",
    borderRadius: 10,
    padding: 14,
    paddingHorizontal: 40,
    marginTop: 30,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "600" },
});