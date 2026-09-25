import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  fetchMyNotifications,
  markAllNotificationsAsRead,
} from "../services/notifications";

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      const data = await fetchMyNotifications();
      setNotifications(data);
      // Mark all as read once the user opens this screen
      await markAllNotificationsAsRead();
    } catch (err) {
      console.log("Error loading notifications:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Reload every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadNotifications();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

    const handleNotificationPress = (item) => {
    if (item.eventId) {
      navigation.navigate("EventDetail", { eventId: item.eventId });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={item.eventId ? 0.7 : 1}
    >
      <View style={styles.iconCircle}>
        <Ionicons name="notifications" size={18} color="#ffffff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
      {item.eventId && (
        <Ionicons name="chevron-forward" size={20} color="#cccccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top bar, matching the rest of the app's design */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.backButton} />
        {/* empty view on the right to keep the title centered */}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2E5395" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={
            notifications.length === 0
              ? styles.emptyContainer
              : styles.listContainer
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#cccccc"
              />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  topBar: {
    backgroundColor: "#2E5395",
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: "#999999",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2E5395",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 2,
  },
  body: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 6,
    lineHeight: 19,
  },
  date: {
    fontSize: 12,
    color: "#999999",
  },
});