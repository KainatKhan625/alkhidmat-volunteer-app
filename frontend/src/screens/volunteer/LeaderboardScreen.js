import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import api from "../../services/api";

export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get("/users/leaderboard");
        setLeaders(response.data);
      } catch (err) {
        console.log("Error fetching leaderboard:", err);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Top Volunteers</Text>
      <FlatList
        data={leaders}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.city}>{item.city}</Text>
            </View>
            <Text style={styles.hours}>{item.totalHours} hrs</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 16, paddingTop: 50 },
  header: { fontSize: 22, fontWeight: "bold", color: "#2E5395", marginBottom: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
  },
  rank: { width: 30, fontSize: 16, fontWeight: "bold", color: "#2E5395" },
  name: { fontSize: 15, fontWeight: "500", color: "#1A1A1A" },
  city: { fontSize: 12, color: "#6B7280" },
  hours: { fontSize: 14, fontWeight: "600", color: "#2E5395" },
});