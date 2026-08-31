import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getDashboardStats } from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";
import { getRecentEvents } from "../../services/adminService";

export default function AdminDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalVolunteers: 0, totalEvents: 0, totalHoursContributed: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [recentEvents, setRecentEvents] = useState([]);

  const fetchStats = async () => {
  try {
    const response = await getDashboardStats();
    setStats(response.data);

        const eventsResponse = await getRecentEvents();
    const today = new Date();
    const upcomingEvents = eventsResponse.data
      .filter((event) => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    setRecentEvents(upcomingEvents.slice(0, 3));
  } catch (err) {
    console.log("Error fetching stats:", err);
  }
};

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appName}>Admin Dashboard</Text>
        <Text style={styles.header}>Welcome, {user?.name}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={24} color="#2E5395" />
            <Text style={styles.statValue}>{stats.totalVolunteers}</Text>
            <Text style={styles.statLabel}>Volunteers</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={24} color="#2E5395" />
            <Text style={styles.statValue}>{stats.totalEvents}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color="#2E5395" />
            <Text style={styles.statValue}>{stats.totalHoursContributed}</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
        </View>

        <View style={styles.quickActionsSection}>
  <Text style={styles.sectionTitle}>Quick Actions</Text>
  <View style={styles.actionBlock}>
    <TouchableOpacity
      style={styles.actionRow}
      onPress={() => navigation.navigate("Events", { screen: "CreateEvent" })}
    >
      <Text style={styles.actionCardText}>Create New Event</Text>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>

    <View style={styles.actionDivider} />

    <TouchableOpacity
      style={styles.actionRow}
      onPress={() => navigation.navigate("Events", { screen: "AdminFeedback" })}
    >
      <Text style={styles.actionCardText}>View Event Feedback</Text>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  </View>
</View>
        <View style={styles.recentSection}>
    <Text style={styles.sectionTitle}>Upcoming Events</Text>
  {recentEvents.length === 0 ? (
    <Text style={styles.emptyText}>No events yet.</Text>
  ) : (
        recentEvents.map((event) => (
      <TouchableOpacity
        key={event.id}
        style={styles.eventCard}
        onPress={() =>
          navigation.navigate("Events", {
            screen: "EditEvent",
            params: { eventId: event.id },
          })
        }
      >
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventMeta}>{event.city} • {event.category}</Text>
      </TouchableOpacity>
    ))
  )}
</View>
      </ScrollView>
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
  header: { fontSize: 22, fontWeight: "bold", color: "#FFFFFF" },
  statsGrid: { flexDirection: "row", justifyContent: "space-between" },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: "bold", color: "#1A1A1A", marginTop: 8 },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  quickActionsSection: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2E5395", marginBottom: 10 },
 actionBlock: {
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
},
actionRow: {
  flexDirection: "row",
  alignItems: "center",
  padding: 14,
},
actionDivider: {
  height: 1,
  backgroundColor: "#F3F4F6",
  marginHorizontal: 14,
},
  actionCardText: { flex: 1, marginLeft: 10, fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
recentSection: { marginTop: 24 },
emptyText: { fontSize: 13, color: "#9CA3AF" },
eventCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  padding: 14,
  marginBottom: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
},
eventTitle: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
eventMeta: { fontSize: 13, color: "#6B7280", marginTop: 2 },

});