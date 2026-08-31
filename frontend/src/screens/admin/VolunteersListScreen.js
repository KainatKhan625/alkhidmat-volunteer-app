import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAllVolunteers } from "../../services/adminService";
import { getEvents } from "../../services/eventService";

export default function VolunteersListScreen() {
    const [volunteers, setVolunteers] = useState([]);
  const [allEventsList, setAllEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null); // null = All Volunteers
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchVolunteers = async () => {
    try {
      const response = await getAllVolunteers();
      setVolunteers(response.data);
    } catch (err) {
      console.log("Error fetching volunteers:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setAllEventsList(response.data);
    } catch (err) {
      console.log("Error fetching events:", err);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchVolunteers(), fetchEvents()]);
      setLoading(false);
    })();
  }, []);

    const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchVolunteers(), fetchEvents()]);
    setRefreshing(false);
  }, []);

  // apply the event filter
  const filteredVolunteers = selectedEvent
    ? volunteers.filter((v) =>
        (v.registrations || []).some((r) => r.event.id === selectedEvent.id)
      )
    : volunteers;

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const statusColor = (status) => {
    if (status === "PRESENT") return "#16A34A";
    if (status === "ABSENT") return "#DC2626";
    return "#6B7280";
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appName}>Admin Dashboard</Text>
        <Text style={styles.header}>Volunteers</Text>
        <Text style={styles.statsText}>{filteredVolunteers.length} total</Text>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => setDropdownOpen(true)}>
          <Ionicons name="filter-outline" size={16} color="#2E5395" />
          <Text style={styles.dropdownButtonText} numberOfLines={1}>
            {selectedEvent ? selectedEvent.title : "All Volunteers"}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#2E5395" />
        </TouchableOpacity>
      </View>

      {!loading && filteredVolunteers.length === 0 && (
        <Text style={styles.emptyText}>No volunteers found.</Text>
      )}

      <FlatList
        data={filteredVolunteers}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          const registrations = item.registrations || [];

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => toggleExpand(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardTop}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.hours}>{item.totalHours} hrs</Text>
              </View>
              <Text style={styles.meta}>{item.email}</Text>
              <Text style={styles.meta}>{item.city} {item.skills ? `• ${item.skills}` : ""}</Text>

              <View style={styles.eventsRow}>
                <Ionicons name="calendar-outline" size={14} color="#2E5395" />
                <Text style={styles.eventsCount}>
                  {registrations.length} event{registrations.length !== 1 ? "s" : ""}
                </Text>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#9CA3AF"
                  style={{ marginLeft: "auto" }}
                />
              </View>

              {isExpanded && (
                <View style={styles.expandedList}>
                  {registrations.length === 0 ? (
                    <Text style={styles.noEventsText}>Not registered for any events yet.</Text>
                  ) : (
                    registrations.map((r) => (
                      <View key={r.id} style={styles.eventItem}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.eventItemTitle}>{r.event.title}</Text>
                          <Text style={styles.eventItemDate}>{formatDate(r.event.date)}</Text>
                        </View>
                        <Text style={[styles.eventItemStatus, { color: statusColor(r.status) }]}>
                          {r.status}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      />

      {/* Dropdown modal for event filter */}
      <Modal visible={dropdownOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Event</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setSelectedEvent(null);
                setDropdownOpen(false);
              }}
            >
              <Text style={styles.modalOptionText}>All Volunteers</Text>
              {!selectedEvent && <Ionicons name="checkmark" size={18} color="#2E5395" />}
            </TouchableOpacity>

                        {allEventsList.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedEvent(event);
                  setDropdownOpen(false);
                }}
              >
                <Text style={styles.modalOptionText} numberOfLines={1}>
                  {event.title}
                </Text>
                {selectedEvent?.id === event.id && (
                  <Ionicons name="checkmark" size={18} color="#2E5395" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: 12,
  },
  appName: { fontSize: 13, color: "#C7D4E8", fontWeight: "500", marginBottom: 4 },
  header: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  statsText: { fontSize: 13, color: "#C7D4E8", fontWeight: "500", marginTop: 8 },
  filterRow: { paddingHorizontal: 16, marginBottom: 12 },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
  },
  dropdownButtonText: { flex: 1, fontSize: 14, color: "#1A1A1A", fontWeight: "500" },
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
  name: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  hours: { fontSize: 14, fontWeight: "600", color: "#2E5395" },
  meta: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  eventsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 6,
  },
  eventsCount: { fontSize: 13, color: "#2E5395", fontWeight: "600" },
  expandedList: { marginTop: 10, gap: 8 },
  noEventsText: { fontSize: 13, color: "#9CA3AF", fontStyle: "italic" },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 10,
  },
  eventItemTitle: { fontSize: 13, fontWeight: "600", color: "#1A1A1A" },
  eventItemDate: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  eventItemStatus: { fontSize: 11, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 30,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalOptionText: { fontSize: 14, color: "#1A1A1A", flex: 1, marginRight: 8 },
});