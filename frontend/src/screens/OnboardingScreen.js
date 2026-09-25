import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: 1,
    title: "Welcome to Alkhidmat",
    subtitle: "SERVE HUMANITY",
    description:
      "Join a growing community dedicated to making a real difference. Your journey of impact starts here!",
    icon: "👋",
    accentColor: "#2E5395",
  },
  {
    id: 2,
    title: "Find Opportunities",
    subtitle: "DISCOVER & ENGAGE",
    description:
      "Discover various volunteering opportunities that match your unique interests and skills.",
    icon: "🔍",
    accentColor: "#2E5395",
  },
  {
    id: 3,
    title: "Build Your Impact",
    subtitle: "TRACK PROGRESS",
    description:
      "Track your contributions, earn badges, and climb the leaderboard while helping others.",
    icon: "🏆",
    accentColor: "#2E5395",
  },
  {
    id: 4,
    title: "Get Started",
    subtitle: "READY TO HELP",
    description:
      "You're all set! Browse events, register for volunteering, and start your journey today.",
    icon: "🚀",
    accentColor: "#2E5395",
  },
];

export default function OnboardingScreen({ onDone }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animate fade in when slide changes
  React.useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: width * nextSlide,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    onDone();
  };

  const handleFinish = () => {
    onDone();
  };

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const slide = Math.ceil(
      event.nativeEvent.contentOffset.x / slideSize
    );
    setCurrentSlide(slide);
  };

  const isLastSlide = currentSlide === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      {/* Decorative Background Accents */}
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />

      {/* Header Container with Skip Action */}
      <View style={styles.header}>
        <View style={styles.headerBrandContainer}>
          <Text style={styles.headerBrandText}>ALKHIDMAT</Text>
        </View>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={isLastSlide}
        >
          <Text style={[styles.skipButtonText, isLastSlide && styles.hiddenText]}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slides Container */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scrollView}
      >
        {SLIDES.map((slide) => (
          <Animated.View
            key={slide.id}
            style={[
              styles.slide,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{slide.icon}</Text>
              </View>
              <Text style={styles.subtitleTag}>{slide.subtitle}</Text>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Footer Navigation Bar */}
      <View style={styles.footer}>
        {/* Progress Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Control Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              isLastSlide && styles.hiddenButton,
            ]}
            onPress={handleSkip}
            disabled={isLastSlide}
          >
            <Text style={styles.buttonTextSecondary}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={isLastSlide ? handleFinish : handleNext}
          >
            <Text style={styles.buttonText}>
              {isLastSlide ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.OS === "web" ? "100vh" : "100%",
    backgroundColor: "#F8FAFC",
    position: "relative",
    overflow: "hidden",
  },
  topCircle: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(15, 43, 91, 0.05)",
  },
  bottomCircle: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(15, 43, 91, 0.04)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  headerBrandContainer: {
    backgroundColor: "rgba(15, 43, 91, 0.08)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  headerBrandText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F2B5B",
    letterSpacing: 1.5,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  hiddenText: {
    opacity: 0,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#0F2B5B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#F0F4FA",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  icon: {
    fontSize: 42,
  },
  subtitleTag: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0F2B5B",
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F2B5B",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 28,
    backgroundColor: "#0F2B5B",
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#CBD5E1",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#2E5395",
    elevation: 3,
    shadowColor: "#0F2B5B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  secondaryButton: {
    backgroundColor: "#E2E8F0",
  },
  hiddenButton: {
    opacity: 0,
    pointerEvents: "none",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
  },
});