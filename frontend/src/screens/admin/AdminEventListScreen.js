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
import { getEvents, deleteEvent } from "../../services/eventService";

export default function AdminEventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data);
    } catch (err) {
      console.log("Error fetching events:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchEvents();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchEvents();
      setLoading(false);
    })();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, []);

  const handleDelete = (event) => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete "${event.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEvent(event.id);
              fetchEvents();
            } catch (err) {
              Alert.alert("Error", "Could not delete this event.");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
  <Text style={styles.appName}>Admin Dashboard</Text>
  <Text style={styles.header}>Manage Events</Text>
  <View style={styles.statsRow}>
    <Text style={styles.statsText}>{events.length} total event{events.length !== 1 ? "s" : ""}</Text>
  </View>
</View>

      {!loading && events.length === 0 && (
        <Text style={styles.emptyText}>No events yet. Tap + to create one.</Text>
      )}

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => navigation.navigate("EditEvent", { eventId: item.id })}
            >
              <View style={styles.cardHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardMeta}>
                📍 {item.city} • 👥 {item._count?.registrations ?? 0}/{item.seatsRequired} registered
              </Text>
            </TouchableOpacity>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("EventAttendance", { eventId: item.id, eventTitle: item.title })}
              >
                <Ionicons name="checkmark-done-outline" size={18} color="#2E5395" />
                <Text style={styles.actionText}>Attendance</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}>
                <Ionicons name="trash-outline" size={18} color="#DC2626" />
                <Text style={[styles.actionText, { color: "#DC2626" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 90 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateEvent")}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  topBar: {
    backgroundColor: "#2E5395",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  appName: { fontSize: 13, color: "#C7D4E8", fontWeight: "500", marginBottom: 4 },
  header: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  statsRow: {
    marginTop: 8,
  },
  statsText: {
    fontSize: 13,
    color: "#C7D4E8",
    fontWeight: "500",
  },
  emptyText: { textAlign: "center", color: "#6B7280", marginTop: 40 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  categoryBadge: { backgroundColor: "#EFF3FA", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  categoryText: { color: "#2E5395", fontSize: 12, fontWeight: "600" },
  cardDate: { fontSize: 12, color: "#2E5395", fontWeight: "600" },
  cardTitle: { fontSize: 17, fontWeight: "700", color: "#1A1A1A", marginBottom: 6 },
  cardMeta: { fontSize: 13, color: "#6B7280", marginBottom: 10 },
  cardActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
    gap: 20,
  },
  actionButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionText: { fontSize: 13, color: "#2E5395", fontWeight: "600" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#2E5395",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

});