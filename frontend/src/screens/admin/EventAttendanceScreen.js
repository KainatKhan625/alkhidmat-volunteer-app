import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getEventRegistrations, markAttendance } from "../../services/registrationService";

export default function EventAttendanceScreen({ route, navigation }) {
  const { eventId, eventTitle } = route.params;

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRegistrations = async () => {
    try {
      const response = await getEventRegistrations(eventId);
      setRegistrations(response.data);
    } catch (err) {
      console.log("Error fetching registrations:", err);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchRegistrations();
      setLoading(false);
    })();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRegistrations();
    setRefreshing(false);
  }, []);

  const handleMark = async (registrationId, status) => {
    setUpdatingId(registrationId);
    try {
      await markAttendance(registrationId, status);
      await fetchRegistrations();
    } catch (err) {
      Alert.alert("Error", "Could not update attendance. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.appName}>Attendance</Text>
          <Text style={styles.header} numberOfLines={1}>{eventTitle}</Text>
        </View>
      </View>

      {!loading && registrations.length === 0 && (
        <Text style={styles.emptyText}>No volunteers registered for this event yet.</Text>
      )}

      <FlatList
        data={registrations}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.name}>{item.user.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  item.status === "PRESENT" && styles.statusPresent,
                  item.status === "ABSENT" && styles.statusAbsent,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === "PRESENT" && styles.statusTextPresent,
                    item.status === "ABSENT" && styles.statusTextAbsent,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
            <Text style={styles.meta}>{item.user.email}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.presentButton]}
                onPress={() => handleMark(item.id, "PRESENT")}
                disabled={updatingId === item.id}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#16A34A" />
                <Text style={styles.presentText}>Present</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.absentButton]}
                onPress={() => handleMark(item.id, "ABSENT")}
                disabled={updatingId === item.id}
              >
                <Ionicons name="close-circle-outline" size={18} color="#DC2626" />
                <Text style={styles.absentText}>Absent</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  topBar: {
    backgroundColor: "#2E5395",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: { marginRight: 12 },
  appName: { fontSize: 13, color: "#C7D4E8", fontWeight: "500", marginBottom: 2 },
  header: { fontSize: 18, fontWeight: "bold", color: "#FFFFFF" },
  emptyText: { textAlign: "center", color: "#6B7280", marginTop: 40 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  meta: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  statusBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPresent: { backgroundColor: "#DCFCE7" },
  statusAbsent: { backgroundColor: "#FEE2E2" },
  statusText: { fontSize: 11, fontWeight: "700", color: "#6B7280" },
  statusTextPresent: { color: "#16A34A" },
  statusTextAbsent: { color: "#DC2626" },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    marginTop: 12,
    paddingTop: 12,
    gap: 20,
  },
  actionButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  presentText: { fontSize: 13, fontWeight: "600", color: "#16A34A" },
  absentText: { fontSize: 13, fontWeight: "600", color: "#DC2626" },
});