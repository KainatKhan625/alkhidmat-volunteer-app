import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { signup } from "../../services/authService";

export default function SignupScreen({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
  if (!form.name.trim()) {
    Alert.alert("Missing info", "Full name is required.");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
    Alert.alert("Invalid email", "Please enter a valid email address (e.g. name@example.com).");
    return false;
  }

  const phoneRegex = /^03[0-9]{9}$/;
  if (!form.phone.trim() || !phoneRegex.test(form.phone.trim())) {
    Alert.alert("Invalid phone", "Please enter a valid 11-digit phone number starting with 03 (e.g. 03001234567).");
    return false;
  }

  if (!form.city.trim()) {
    Alert.alert("Missing info", "City is required.");
    return false;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  if (!form.password || !passwordRegex.test(form.password)) {
    Alert.alert(
      "Weak password",
      "Password must be at least 6 characters and include both letters and numbers."
    );
    return false;
  }

  return true;
};

  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await signup(form);
      Alert.alert(
  "Signup successful",
  "",
  [{ text: "OK", onPress: () => navigation.navigate("Login") }]
);
    } catch (err) {
      Alert.alert(
        "Signup failed",
        err.response?.data?.message ||
          "Could not reach the server. Please check your connection and try again."
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
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={require("../../../assets/images/alkhidmat-logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.label}>
        Full Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={form.name}
        onChangeText={(v) => updateField("name", v)}
      />

      <Text style={styles.label}>
        Email <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(v) => updateField("email", v)}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>
        Phone <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={form.phone}
        onChangeText={(v) => updateField("phone", v)}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>
        City <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="City"
        value={form.city}
        onChangeText={(v) => updateField("city", v)}
      />

      <Text style={styles.label}>Skills (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Teaching, Medical"
        value={form.skills}
        onChangeText={(v) => updateField("skills", v)}
      />

      <Text style={styles.label}>
        Password <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Password (min. 6 characters)"
        value={form.password}
        onChangeText={(v) => updateField("password", v)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating account..." : "Sign Up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.linkBold}>Login</Text>
        </Text>
      </TouchableOpacity>
        </ScrollView>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E5395",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 4,
    marginTop: 4,
    fontWeight: "500",
  },
  required: {
    color: "#FF0000",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2E5395",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "#000000",
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
  linkBold: {
    fontWeight: "bold",
    color: "#2E5395",
  },
});