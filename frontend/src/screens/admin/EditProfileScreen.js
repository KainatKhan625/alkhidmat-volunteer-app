import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/adminService";

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [city, setCity] = useState(user?.city || "");
  const [skills, setSkills] = useState(user?.skills || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Missing info", "Name is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await updateProfile({ name, city, skills });
      await updateUser(response.data);
      Alert.alert("Success", "Profile updated successfully.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Could not update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 40 : 0}
    >
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Edit Profile</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full Name" />

        <Text style={styles.label}>City</Text>
        <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="e.g. Karachi" />

        <Text style={styles.label}>Skills</Text>
        <TextInput
          style={styles.input}
          value={skills}
          onChangeText={setSkills}
          placeholder="e.g. Teaching, Medical"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Saving..." : "Save Changes"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: "#2E5395",
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: { marginRight: 12 },
  topBarTitle: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
  container: { padding: 20, backgroundColor: "#FFFFFF", flex: 1 },
  label: { fontSize: 13, color: "#374151", marginBottom: 6, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2E5395",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});