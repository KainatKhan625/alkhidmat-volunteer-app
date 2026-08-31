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
import { registerForEvent } from "../../services/eventService";
import { useAuth } from "../../context/AuthContext";

const AVAILABILITY_OPTIONS = ["Morning", "Afternoon", "Full Day"];

export default function RegistrationFormScreen({ route, navigation }) {
  const { eventId, eventTitle } = route.params;
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.name || "");
  const [contactNumber, setContactNumber] = useState(user?.phone || "");
  const [cnic, setCnic] = useState("");
  const [availability, setAvailability] = useState("");
  const [relevantExperience, setRelevantExperience] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fullName.trim() || !contactNumber.trim() || !cnic.trim() || !availability) {
      Alert.alert("Missing info", "Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      await registerForEvent({
        eventId,
        fullName,
        contactNumber,
        cnic,
        availability,
        relevantExperience,
        additionalNotes,
      });
      Alert.alert(
        "Registered!",
        "You have successfully registered for this event. You'll receive a QR code for attendance.",
        [{ text: "OK", onPress: () => navigation.popToTop() }]
      );
    } catch (err) {
      Alert.alert(
        "Registration failed",
        err.response?.data?.message || "Something went wrong. Please try again."
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
        <Text style={styles.topBarTitle}>Registration Form</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        
        <Text style={styles.eventName}>{eventTitle}</Text>

        <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Contact Number <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 03001234567"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>CNIC Number <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 42101-1234567-1"
          value={cnic}
          onChangeText={setCnic}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Availability <Text style={styles.required}>*</Text></Text>
        <View style={styles.optionsRow}>
          {AVAILABILITY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionChip,
                availability === option && styles.optionChipSelected,
              ]}
              onPress={() => setAvailability(option)}
            >
              <Text
                style={[
                  styles.optionChipText,
                  availability === option && styles.optionChipTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Relevant Experience (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g. I've volunteered at similar events before"
          value={relevantExperience}
          onChangeText={setRelevantExperience}
          multiline
        />

        <Text style={styles.label}>Additional Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Anything else you'd like to share"
          value={additionalNotes}
          onChangeText={setAdditionalNotes}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Submitting..." : "Submit Registration"}</Text>
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
  eventLabel: { fontSize: 13, color: "#6B7280" },
  eventName: { fontSize: 18, fontWeight: "700", color: "#1A1A1A", marginBottom: 20 },
  label: { fontSize: 14, color: "#1A1A1A", marginBottom: 6, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    fontSize: 15,
  },
  required: { color: "#FF0000", fontWeight: "bold" },
  textArea: { height: 80, textAlignVertical: "top" },
  optionsRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  optionChip: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  optionChipSelected: {
    backgroundColor: "#2E5395",
    borderColor: "#2E5395",
  },
  optionChipText: { fontSize: 13, color: "#374151" },
  optionChipTextSelected: { color: "#FFFFFF", fontWeight: "600" },
  button: {
    backgroundColor: "#2E5395",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});