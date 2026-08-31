import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Linking,
  Modal,
  Image,
} from "react-native";
import { getMyRegistrations } from "../../services/eventService";

const STATUS_COLORS = {
  REGISTERED: { bg: "#EFF3FA", text: "#2E5395" },
  PRESENT: { bg: "#E7F7EE", text: "#16A34A" },
  ABSENT: { bg: "#FEECEC", text: "#DC2626" },
};

export default function MyRegistrationsScreen() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);

  const fetchRegistrations = async () => {
    try {
      const response = await getMyRegistrations();
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.header}>My Registrations</Text>
        <Text style={styles.statsText}>{registrations.length} total</Text>
      </View>

      {!loading && registrations.length === 0 && (
        <Text style={styles.emptyText}>You haven't registered for any events yet.</Text>
      )}

      <FlatList
        data={registrations}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const statusStyle = STATUS_COLORS[item.status] || STATUS_COLORS.REGISTERED;
          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.eventTitle}>{item.event.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.eventMeta}>
                {item.event.city} • {formatDate(item.event.date)}
              </Text>

              {item.status === "PRESENT" && item.certificate && (
                <TouchableOpacity
                  style={styles.certButton}
                  onPress={() => Linking.openURL(item.certificate.fileUrl)}
                >
                  <Text style={styles.certButtonText}>View Certificate</Text>
                </TouchableOpacity>
                

                
              )}

              {item.status === "REGISTERED" && item.qrCode && (
  <TouchableOpacity
    style={styles.qrButton}
    onPress={() => setSelectedQR(item.qrCode)}
  >
    <Text style={styles.qrButtonText}>Show QR Code</Text>
  </TouchableOpacity>
)}
            </View>
          );
        }}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      />

      <Modal
        visible={!!selectedQR}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedQR(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your QR Code</Text>
            <Text style={styles.modalSubtitle}>
              Show this to the coordinator at the event for attendance
            </Text>
            {selectedQR && (
              <Image source={{ uri: selectedQR }} style={styles.qrImage} />
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSelectedQR(null)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    marginBottom: 16,
  },
  header: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  statsText: { fontSize: 13, color: "#C7D4E8", fontWeight: "500", marginTop: 8 },
  emptyText: { textAlign: "center", color: "#6B7280", marginTop: 40, paddingHorizontal: 20 },
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
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  eventTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: "700" },
  eventMeta: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  certButton: {
    marginTop: 12,
    backgroundColor: "#2E5395",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  certButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },

  qrButton: {
  marginTop: 8,
  backgroundColor: "#F5A623",
  borderRadius: 8,
  paddingVertical: 10,
  alignItems: "center",
},
qrButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.6)",
  justifyContent: "center",
  alignItems: "center",
},
modalContent: {
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  padding: 24,
  alignItems: "center",
  width: "85%",
},
modalTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A", marginBottom: 6 },
modalSubtitle: {
  fontSize: 13,
  color: "#6B7280",
  textAlign: "center",
  marginBottom: 16,
},
qrImage: { width: 220, height: 220, marginBottom: 20 },
modalCloseButton: {
  backgroundColor: "#2E5395",
  borderRadius: 10,
  paddingVertical: 12,
  paddingHorizontal: 40,
},
modalCloseButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
});