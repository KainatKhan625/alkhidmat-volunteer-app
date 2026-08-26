import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Image, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation?.replace("Onboarding");
    }, 3000); // 3.5s transition time

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={styles.container}>
      {/* Decorative Background Circles */}
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />

      {/* Main Animated Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Soft Glowing White Logo Badge */}
        <View style={styles.logoBadge}>
          <Image
            source={require("../../../assets/images/alkhidmat-logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>ALKHIDMAT</Text>
        <Text style={styles.foundationTag}>FOUNDATION PAKISTAN</Text>
        
        <View style={styles.pillBadge}>
          <Text style={styles.pillText}>VOLUNTEER MANAGEMENT</Text>
        </View>
      </Animated.View>

      {/* Footer Tagline */}
      <View style={styles.footerContainer}>
        <View style={styles.divider} />
        <Text style={styles.footerText}>Serving Humanity Together</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.OS === "web" ? "100vh" : "100%",
    backgroundColor: "#0F2B5B", // Alkhidmat Deep Navy Blue
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  // Background Accents
  topCircle: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  bottomCircle: {
    position: "absolute",
    bottom: -120,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  content: {
    alignItems: "center",
    zIndex: 2,
  },
  logoBadge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    padding: 12,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoImage: {
    width: "90%",
    height: "90%",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 3,
    textAlign: "center",
  },
  foundationTag: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8DA9C4",
    letterSpacing: 2,
    marginTop: 2,
    marginBottom: 16,
  },
  pillBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  footerContainer: {
    position: "absolute",
    bottom: 45,
    alignItems: "center",
    width: "100%",
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#D0E1F9",
    letterSpacing: 1,
    fontStyle: "italic",
  },
});