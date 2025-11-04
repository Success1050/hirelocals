import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { userSignup } from "./authactions/action";
import Loading from "@/components/Loading";
import { useRouter } from "expo-router";

// Signup Screen Component
const SignupScreen = ({}: {}) => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<
    "user" | "professional" | null
  >(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!selectedRole) {
      alert("Please select your account type");
      return;
    }
    const useremail = email.trim();
    const username = fullName.trim();
    const userphone = phone.trim();
    const userpassword = password.trim();
    const confirmpassword = confirmPassword.trim();

    if (password != confirmPassword) {
      return Alert.alert("error", "password is not same");
    }

    try {
      setLoading(true);
      const res = await userSignup(
        useremail,
        userpassword,
        username,
        userphone,
        selectedRole
      );
      if (res && res.success) {
        Alert.alert("successfull", "logged in successfully");
      }
      console.log(res.error);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    console.log("Signup:", { selectedRole, fullName, email, phone, password });
    // Add your signup logic here
  };

  return (
    <ScreenWrapper bg={theme.colors.activetabbarcolor}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />

        <LinearGradient
          colors={["#1a1a2e", "#16213e", "#0f3460"]}
          style={styles.gradient}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.authHeader}>
              <View style={styles.smallIconCircle}>
                <Text style={styles.smallIconText}>⚡</Text>
              </View>
              <Text style={styles.authTitle}>Create Account</Text>
              <Text style={styles.authSubtitle}>Join SkillConnect today</Text>
            </View>

            <View style={styles.formContainer}>
              {/* Role Selection */}
              <View style={styles.roleSection}>
                <Text style={styles.roleSectionTitle}>I want to</Text>

                <View style={styles.roleCards}>
                  <TouchableOpacity
                    style={[
                      styles.roleCard,
                      selectedRole === "user" && styles.roleCardSelected,
                    ]}
                    onPress={() => setSelectedRole("user")}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.roleIconContainer,
                        selectedRole === "user" &&
                          styles.roleIconContainerSelected,
                      ]}
                    >
                      <Text style={styles.roleCardIcon}>🔍</Text>
                    </View>
                    <Text
                      style={[
                        styles.roleCardTitle,
                        selectedRole === "user" && styles.roleCardTitleSelected,
                      ]}
                    >
                      Hire Professionals
                    </Text>
                    <Text style={styles.roleCardDescription}>
                      Find and hire skilled workers
                    </Text>
                    {selectedRole === "user" && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleCard,
                      selectedRole === "professional" &&
                        styles.roleCardSelected,
                    ]}
                    onPress={() => setSelectedRole("professional")}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.roleIconContainer,
                        selectedRole === "professional" &&
                          styles.roleIconContainerSelected,
                      ]}
                    >
                      <Text style={styles.roleCardIcon}>💼</Text>
                    </View>
                    <Text
                      style={[
                        styles.roleCardTitle,
                        selectedRole === "professional" &&
                          styles.roleCardTitleSelected,
                      ]}
                    >
                      Offer My Services
                    </Text>
                    <Text style={styles.roleCardDescription}>
                      Get hired for your skills
                    </Text>
                    {selectedRole === "professional" && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Form Fields */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#7f8ea3"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>📧</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#7f8ea3"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>📱</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="08012345678"
                    placeholderTextColor="#7f8ea3"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    placeholderTextColor="#7f8ea3"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#7f8ea3"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSignup}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#e94560", "#d63447"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? (
                      <ActivityIndicator
                        size={24}
                        color={theme.colors.activetabbarcolor}
                      />
                    ) : (
                      "Create Account"
                    )}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.loginPrompt}>
                <Text style={styles.loginPromptText}>
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => router.push("/auth/signin")}>
                  <Text style={styles.loginPromptLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.circle3} />
        </LinearGradient>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default SignupScreen;

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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
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
  smallIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(233, 69, 96, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(233, 69, 96, 0.4)",
    marginBottom: 20,
  },
  smallIconText: {
    fontSize: 32,
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
  circle3: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(233, 69, 96, 0.08)",
    top: 80,
    right: -60,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: "#e94560",
    fontSize: 16,
    fontWeight: "600",
  },
  authHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  authTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: "#a8b2d1",
  },
  formContainer: {
    width: "100%",
  },
  roleSection: {
    marginBottom: 30,
  },
  roleSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
  roleCards: {
    flexDirection: "row",
    gap: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  },
  roleCardSelected: {
    backgroundColor: "rgba(233, 69, 96, 0.15)",
    borderColor: "#e94560",
  },
  roleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  roleIconContainerSelected: {
    backgroundColor: "rgba(233, 69, 96, 0.3)",
  },
  roleCardIcon: {
    fontSize: 28,
  },
  roleCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 6,
  },
  roleCardTitleSelected: {
    color: "#e94560",
  },
  roleCardDescription: {
    fontSize: 12,
    color: "#a8b2d1",
    textAlign: "center",
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e94560",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#e94560",
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  dividerText: {
    color: "#a8b2d1",
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(233, 69, 96, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginPromptText: {
    color: "#a8b2d1",
    fontSize: 14,
  },
  loginPromptLink: {
    color: "#e94560",
    fontSize: 14,
    fontWeight: "600",
  },
});
