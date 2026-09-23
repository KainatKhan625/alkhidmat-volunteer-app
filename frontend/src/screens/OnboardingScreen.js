import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    title: "Welcome to Alkhidmat",
    description: "Join hands with us to serve the community and make a real difference.",
    image: require("../../assets/images/alkhidmat-logo.png"),
  },
  {
    key: "2",
    title: "Find Events",
    description: "Browse volunteer events near you, filtered by city and category.",
    image: require("../../assets/images/alkhidmat-logo.png"),
  },
  {
    key: "3",
    title: "Track Attendance",
    description: "Register for events and check in easily using QR code scanning.",
    image: require("../../assets/images/alkhidmat-logo.png"),
  },
  {
    key: "4",
    title: "Earn Certificates",
    description: "Get automatic certificates and climb the leaderboard as you volunteer.",
    image: require("../../assets/images/alkhidmat-logo.png"),
  },
];

export default function OnboardingScreen({ onDone }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onDone();
    }
  };

  const handleSkip = () => {
    onDone();
  };

  const handleScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={handleScrollEnd}
      />

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>
          {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: "#2E5395",
    fontWeight: "600",
  },
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E5395",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#555555",
    textAlign: "center",
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: "#2E5395",
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#cccccc",
  },
  nextButton: {
    backgroundColor: "#2E5395",
    marginHorizontal: 32,
    marginBottom: 40,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  nextText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});