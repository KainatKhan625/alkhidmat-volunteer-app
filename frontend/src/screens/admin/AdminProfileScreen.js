import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import { uploadProfilePicture, updateProfile } from "../../services/adminService";
import { changePassword } from "../../services/authService";
export default function AdminProfileScreen({ navigation }) {
  const { user, logout, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [changingPassword, setChangingPassword] = useState(false);

  const [name, setName] = useState(user?.name || "");
const [email, setEmail] = useState(user?.email || "");
const [phone, setPhone] = useState(user?.phone || "");
const [city, setCity] = useState(user?.city || "");
const [designation, setDesignation] = useState(user?.designation || "");
const [department, setDepartment] = useState(user?.department || "");

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission needed", "Please allow access to your photos to set a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;
    await handleUpload(result.assets[0]);
  };

  const handleUpload = async (image) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: image.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      const response = await uploadProfilePicture(formData);
      await updateUser({ profilePic: response.data.profilePic });
    } catch (err) {
      Alert.alert("Upload failed", "Could not update profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Missing info", "Name is required.");
      return;
    }

    setSaving(true);
    try {
      const response = await updateProfile({ name, email, phone, city, designation, department });
      await updateUser(response.data);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Could not update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };
  const handleChangePassword = async () => {
  if (!currentPassword || !newPassword) {
    Alert.alert("Missing info", "Please enter both current and new password.");
    return;
  }

  setChangingPassword(true);
  try {
    await changePassword(currentPassword, newPassword);
    Alert.alert("Success", "Password changed successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setShowPasswordForm(false);
  } catch (err) {
    Alert.alert(
      "Error",
      err.response?.data?.message || "Could not change password. Please try again."
    );
  } finally {
    setChangingPassword(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 40 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={handlePickImage} disabled={uploading} style={styles.avatarWrap}>
          {user?.profilePic ? (
            <Image source={{ uri: user.profilePic }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{user?.name?.[0]?.toUpperCase()}</Text>
            </View>
          )}

          <View style={styles.editBadge}>
            {uploading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.editBadgeText}>Edit</Text>
            )}
          </View>
        </TouchableOpacity>

        
        <Text style={styles.roleBadge}>Administrator</Text>

        <View style={styles.form}>
  <Text style={styles.label}>Name *</Text>
  <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full Name" />

  <Text style={styles.label}>Email *</Text>
  <TextInput
    style={styles.input}
    value={email}
    onChangeText={setEmail}
    placeholder="Email"
    autoCapitalize="none"
    keyboardType="email-address"
  />

  <Text style={styles.label}>Phone</Text>
  <TextInput
    style={styles.input}
    value={phone}
    onChangeText={setPhone}
    placeholder="e.g. 03001234567"
    keyboardType="phone-pad"
  />

  <Text style={styles.label}>City</Text>
  <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="e.g. Karachi" />

  <Text style={styles.label}>Designation</Text>
  <TextInput
    style={styles.input}
    value={designation}
    onChangeText={setDesignation}
    placeholder="e.g. Program Coordinator"
  />

  <Text style={styles.label}>Department</Text>
  <TextInput
    style={styles.input}
    value={department}
    onChangeText={setDepartment}
    placeholder="e.g. Operations"
  />

  <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
    <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Save Changes"}</Text>
  </TouchableOpacity>
</View>
<View style={styles.settingsSection}>
  <TouchableOpacity
    style={styles.settingsRow}
    onPress={() => navigation.navigate("ChangePassword")}
  >
    <Text style={styles.settingsRowText}>Change Password</Text>
    <Text style={styles.settingsRowArrow}>›</Text>
  </TouchableOpacity>
</View>


        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.appVersion}>Alkhidmat Volunteer App v1.0.0</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 24, paddingTop: 60, backgroundColor: "#FFFFFF", flexGrow: 1 },
  avatarWrap: { marginBottom: 8 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#2E5395",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { color: "#FFFFFF", fontSize: 32, fontWeight: "bold" },
  editBadge: {
    position: "absolute",
    bottom: -4,
    right: -6,
    backgroundColor: "#2E5395",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  editBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" },
  email: { fontSize: 14, color: "#6B7280", marginTop: 8 },
  roleBadge: {
    marginTop: 10,
    backgroundColor: "#EFF3FA",
    color: "#2E5395",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  form: { width: "100%", marginTop: 28 },
  label: { fontSize: 13, color: "#374151", marginBottom: 6, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: "#2E5395",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  logoutButton: {
    backgroundColor: "#DC2626",
    borderRadius: 10,
    padding: 14,
    paddingHorizontal: 40,
    marginTop: 24,
  },
  settingsSection: { width: "100%", marginTop: 20 },
settingsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#F9FAFB",
  borderRadius: 12,
  padding: 16,
},
settingsRowText: { fontSize: 15, color: "#1A1A1A", fontWeight: "500" },
settingsRowArrow: { fontSize: 20, color: "#9CA3AF" },

  passwordSection: { width: "100%", marginTop: 20 },
passwordToggle: {
  alignItems: "center",
  paddingVertical: 10,
},
passwordToggleText: {
  color: "#2E5395",
  fontSize: 14,
  fontWeight: "600",
},
passwordForm: {
  marginTop: 10,
  backgroundColor: "#F9FAFB",
  borderRadius: 12,
  padding: 16,
},

appVersion: {
  fontSize: 12,
  color: "#9CA3AF",
  marginTop: 20,
  marginBottom: 10,
},
  logoutButtonText: { color: "#FFFFFF", fontWeight: "600" },
});