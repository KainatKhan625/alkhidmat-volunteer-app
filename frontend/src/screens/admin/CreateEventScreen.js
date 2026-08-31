import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createEvent } from "../../services/eventService";

export default function CreateEventScreen({ navigation }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    city: "",
    location: "",
    date: "",
    seatsRequired: "",
  });
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const handleSubmit = async () => {
  if (!form.title || !form.description || !form.category || !form.city || !form.date || !form.seatsRequired) {
    Alert.alert("Missing info", "Please fill all required fields.");
    return;
  }

  setLoading(true);
  try {
    await createEvent({
      ...form,
      seatsRequired: parseInt(form.seatsRequired, 10),
      date: new Date(form.date).toISOString(),
    });
    Alert.alert("Success", "Event created successfully.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  } catch (err) {
    Alert.alert(
      "Error",
      err.response?.data?.message || "Could not create event. Please try again."
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
        <Text style={styles.topBarTitle}>Create Event</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Event Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Blood Donation Drive - DHA"
          value={form.title}
          onChangeText={(v) => updateField("title", v)}
        />
        <Text style={styles.label}>Description *</Text>
<TextInput
  style={[styles.input, styles.textArea]}
  placeholder="Describe what volunteers will do"
  value={form.description}
  onChangeText={(v) => updateField("description", v)}
  multiline
  numberOfLines={4}
/>

<Text style={styles.label}>Category *</Text>
<TextInput
  style={styles.input}
  placeholder="e.g. Medical, Relief Work, Education"
  value={form.category}
  onChangeText={(v) => updateField("category", v)}
/>

<Text style={styles.label}>City *</Text>
<TextInput
  style={styles.input}
  placeholder="e.g. Karachi"
  value={form.city}
  onChangeText={(v) => updateField("city", v)}
/>

<Text style={styles.label}>Location (optional)</Text>
<TextInput
  style={styles.input}
  placeholder="e.g. DHA Phase 6"
  value={form.location}
  onChangeText={(v) => updateField("location", v)}
/>

<Text style={styles.label}>Date *</Text>
<TextInput
  style={styles.input}
  placeholder="YYYY-MM-DD (e.g. 2026-09-15)"
  value={form.date}
  onChangeText={(v) => updateField("date", v)}
/>

<Text style={styles.label}>Volunteers Needed *</Text>
<TextInput
  style={styles.input}
  placeholder="e.g. 20"
  value={form.seatsRequired}
  onChangeText={(v) => updateField("seatsRequired", v)}
  keyboardType="number-pad"
/>
<TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
  <Text style={styles.buttonText}>{loading ? "Creating..." : "Create Event"}</Text>
</TouchableOpacity>
      </ScrollView>
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
  container: { padding: 20, backgroundColor: "#FFFFFF", flexGrow: 1 },
  label: { fontSize: 13, color: "#374151", marginBottom: 6, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    fontSize: 15,
  },
  textArea: {
  height: 90,
  textAlignVertical: "top",
},
button: {
  backgroundColor: "#2E5395",
  borderRadius: 10,
  padding: 16,
  alignItems: "center",
  marginTop: 8,
  marginBottom: 30,
},
buttonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "600",
},
});