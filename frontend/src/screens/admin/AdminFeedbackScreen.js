import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAllFeedback } from "../../services/adminService";

export default function AdminFeedbackScreen({ navigation }) {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeedback = async () => {
    try {
      const response = await getAllFeedback();
      setFeedback(response.data);
    } catch (err) {
      console.log("Error fetching feedback:", err);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchFeedback();
      setLoading(false);
    })();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFeedback();
    setRefreshing(false);
  }, []);

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
  <View style={styles.topBarRow}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
    </TouchableOpacity>
    <Text style={styles.appName}>Admin Dashboard</Text>
  </View>
  <Text style={styles.header}>Event Feedback</Text>
  <Text style={styles.statsText}>{feedback.length} total</Text>
</View>

      {!loading && feedback.length === 0 && (
        <Text style={styles.emptyText}>No feedback submitted yet.</Text>
      )}

      <FlatList
        data={feedback}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.eventTitle}>{item.event.title}</Text>
              <Text style={styles.stars}>{renderStars(item.rating)}</Text>
            </View>
            <Text style={styles.volunteerName}>By {item.user.name}</Text>
            {item.comment ? (
              <Text style={styles.comment}>"{item.comment}"</Text>
            ) : null}
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
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  topBarRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
backButton: { marginRight: 10 },
  appName: { fontSize: 13, color: "#C7D4E8", fontWeight: "500", marginBottom: 4 },
  header: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  statsText: { fontSize: 13, color: "#C7D4E8", fontWeight: "500", marginTop: 8 },
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
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  eventTitle: { fontSize: 15, fontWeight: "700", color: "#1A1A1A", flex: 1 },
  stars: { fontSize: 14, color: "#F5A623" },
  volunteerName: { fontSize: 13, color: "#6B7280", marginBottom: 6 },
  comment: { fontSize: 14, color: "#374151", fontStyle: "italic" },
});