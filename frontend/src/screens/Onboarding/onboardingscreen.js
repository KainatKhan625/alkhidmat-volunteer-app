import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";
import { useOnboarding } from "../../context/onboardingcontext";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    id: 1,
    title: "Welcome to Alkhidmat",
    description:
      "Join a growing community dedicated to making a real difference. Your journey of impact starts here!",
    icon: "👋",
    color: "#a5c7fa",
  },
  {
    id: 2,
    title: "Find Opportunities",
    description:
      "Discover various volunteering opportunities that match your interests and skills.",
    icon: "🔍",
    color: "#a5c7fa",
  },
  {
    id: 3,
    title: "Build Your Impact",
    description:
      "Track your contributions, earn badges, and climb the leaderboard while helping others.",
    icon: "🏆",
    color: "#a5c7fa",
  },
  {
    id: 4,
    title: "Get Started",
    description:
      "You're all set! Browse events, register for volunteering, and start your journey.",
    icon: "🚀",
    color: "#a5c7fa",
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef(null);
  const { completeOnboarding } = useOnboarding();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animate fade in when slide changes
  React.useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
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

  const handleSkip = async () => {
    await completeOnboarding();
    navigation.replace("Login");
  };

  const handleFinish = async () => {
    await completeOnboarding();
    navigation.replace("Login");
  };

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const slide = Math.ceil(
      event.nativeEvent.contentOffset.x / slideSize
    );
    setCurrentSlide(slide);
  };

  const currentSlideData = SLIDES[currentSlide];
  const isLastSlide = currentSlide === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        disabled={isLastSlide}
      >
        <Text style={styles.skipButtonText}>
          {isLastSlide ? "" : "Skip"}
        </Text>
      </TouchableOpacity>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
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
            <View
              style={[
                styles.slideContent,
                { backgroundColor: slide.color + "20" },
              ]}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{slide.icon}</Text>
              </View>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Progress Indicators */}
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentSlide ? "#333" : "#ddd",
                width: index === currentSlide ? 30 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Buttons Container */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "flex-end",
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
  slide: {
    width: width,
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  slideContent: {
    alignItems: "center",
    paddingVertical: 40,
    borderRadius: 20,
    padding: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  primaryButton: {
    backgroundColor: "#2E5395",
  },
  secondaryButton: {
    backgroundColor: "#2E5395",
  },
  hiddenButton: {
    opacity: 0,
    pointerEvents: "none",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});