import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getEventById } from "../../services/eventService";

export default function EventDetailScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);


  useEffect(() => {
    (async () => {
      try {
        const response = await getEventById(eventId);
        setEvent(response.data);
      } catch (err) {
        console.log("Error fetching event:", err);
      }
    })();
  }, [eventId]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Event Details</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>

        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.meta}>{event.city}</Text>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#2E5395" />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{formatDate(event.date)}</Text>
          </View>
        </View>

        {event.location && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#2E5395" />
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{event.location}</Text>
            </View>
          </View>
        )}

        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={20} color="#2E5395" />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoLabel}>Volunteers Needed</Text>
            <Text style={styles.infoValue}>{event.seatsRequired}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.descriptionLabel}>About this event</Text>
        <Text style={styles.description}>{event.description}</Text>

        <TouchableOpacity
  style={styles.button}
  onPress={() =>
    navigation.navigate("RegistrationForm", {
      eventId: event.id,
      eventTitle: event.title,
    })
  }
>
  <Text style={styles.buttonText}>Register for this Event</Text>
</TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  categoryBadge: {
    backgroundColor: "#EFF3FA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  categoryText: { color: "#2E5395", fontSize: 12, fontWeight: "600" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1A1A1A", marginBottom: 4 },
  meta: { fontSize: 14, color: "#6B7280", marginBottom: 16 },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 16 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  infoTextWrap: { marginLeft: 12 },
  infoLabel: { fontSize: 12, color: "#6B7280" },
  infoValue: { fontSize: 15, color: "#1A1A1A", fontWeight: "600", marginTop: 2 },
  descriptionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  description: { fontSize: 14, color: "#374151", lineHeight: 21, marginBottom: 30 },
  button: {
    backgroundColor: "#2E5395",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});