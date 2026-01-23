import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function Index() {
  const router = useRouter();
  const handleLogin = () => {
    console.log("Navigate to Login");
    router.push("/UserDashboard");
    // Navigation logic here
  };

  const handleSignup = () => {
    console.log("Navigate to Signup");
    router.push("/auth/signup");
    // Navigation logic here
  };

  return (
    <ScreenWrapper bg="#1a1a2e">
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <LinearGradient
          colors={["#1a1a2e", "#16213e", "#0f3460"]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {/* Logo/Icon Area */}
            <View style={styles.logoContainer}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>⚡</Text>
              </View>
            </View>

            {/* Title Section */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>SkillConnect</Text>
              <Text style={styles.subtitle}>Find Trusted Professionals</Text>
              <Text style={styles.description}>
                From teachers to plumbers, electricians to house maids - connect
                with skilled professionals in your area
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>👥</Text>
                <Text style={styles.featureText}>Verified Professionals</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>⭐</Text>
                <Text style={styles.featureText}>Rated & Reviewed</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>💼</Text>
                <Text style={styles.featureText}>All Skills Available</Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#e94560", "#d63447"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.signupButtonText}>Get Started</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Decorative Elements */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </LinearGradient>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: "relative",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(233, 69, 96, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(233, 69, 96, 0.4)",
  },
  iconText: {
    fontSize: 48,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 20,
    color: "#e94560",
    marginBottom: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    color: "#a8b2d1",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  feature: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: "#a8b2d1",
    textAlign: "center",
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  signupButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signupButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  loginButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(233, 69, 96, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  circle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(233, 69, 96, 0.1)",
    top: -50,
    right: -50,
  },
  circle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(233, 69, 96, 0.08)",
    bottom: 100,
    left: -30,
  },
});
