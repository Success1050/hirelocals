import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Switch,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import { theme } from "@/constants/theme";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";

const ProfessionalDashboard = () => {
  const router = useRouter();
  const { user, logout: authLogout } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(false);

  // Mock Data
  const stats = [
    { label: "Total Earnings", value: "₦125,000", icon: "wallet", color: "#FBBF24" },
    { label: "Jobs Done", value: "45", icon: "briefcase-check", color: "#3B82F6" },
    { label: "Rating", value: "4.8", icon: "star", color: "#10B981" },
    { label: "Views", value: "1.2k", icon: "eye", color: "#8B5CF6" },
  ];

  const recentJobs = [
    {
      id: 1,
      client: "Chidinma Okeke",
      service: "Kitchen Plumbing",
      date: "Today, 2:00 PM",
      price: "₦15,000",
      status: "Pending",
    },
    {
      id: 2,
      client: "Tunde Bakare",
      service: "Tap Repair",
      date: "Yesterday",
      price: "₦5,000",
      status: "Completed",
    },
    {
      id: 3,
      client: "Sarah J.",
      service: "Pipe Leakage",
      date: "Oct 24",
      price: "₦25,000",
      status: "Completed",
    },
  ];

  const quickLinks = [
    {
      title: "Manage Jobs",
      icon: "calendar-check",
      route: "/(professionals)/Jobs",
      color: "#3B82F6",
    },
    {
      title: "Earnings",
      icon: "chart-line",
      route: "/(professionals)/Earnings",
      color: "#10B981",
    },
    {
      title: "Profile",
      icon: "account-cog",
      route: "/(professionals)/Profile",
      color: "#FBBF24",
    },
    {
      title: "Support",
      icon: "headset",
      route: "/(professionals)/Profile", // Redirect to Profile for now or a support page if created
      color: "#EC4899",
    },
  ];

  const logout = async () => {
    try {
      await authLogout();
      router.replace("/auth/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSwitch = () => setIsOnline((previousState) => !previousState);

  return (
    <ScreenWrapper bg={"#030712"}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>
              {user ? `${user.firstName} ${user.lastName}` : "Professional"}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Availability Toggle */}
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityInfo}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOnline ? "#10B981" : "#4B5563" },
              ]}
            />
            <Text style={styles.availabilityText}>
              {isOnline ? "You are Online" : "You are Offline"}
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#374151", true: "#10B981" }}
            thumbColor={isOnline ? "#fff" : "#9CA3AF"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isOnline}
          />
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${stat.color}20` },
                ]}
              >
                <MaterialCommunityIcons
                  name={stat.icon as any}
                  size={24}
                  color={stat.color}
                />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickLinksContainer}>
          {quickLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.linkCard}
              onPress={() => router.push(link.route as any)}
            >
              <View
                style={[
                  styles.linkIcon,
                  { backgroundColor: `${link.color}20` },
                ]}
              >
                <MaterialCommunityIcons
                  name={link.icon as any}
                  size={28}
                  color={link.color}
                />
              </View>
              <Text style={styles.linkTitle}>{link.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Jobs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Jobs</Text>
          <TouchableOpacity onPress={() => router.push("/(professionals)/Jobs")}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.jobsList}>
          {recentJobs.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobInfo}>
                <View style={styles.clientAvatar}>
                  <Text style={styles.avatarText}>{job.client.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.jobClient}>{job.client}</Text>
                  <Text style={styles.jobService}>{job.service}</Text>
                </View>
              </View>
              <View style={styles.jobRight}>
                <Text style={styles.jobPrice}>{job.price}</Text>
                <Text
                  style={[
                    styles.jobStatus,
                    {
                      color:
                        job.status === "Completed" ? "#10B981" : "#F59E0B",
                    },
                  ]}
                >
                  {job.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ marginBottom: 80 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ProfessionalDashboard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  greeting: {
    fontSize: 14,
    color: "#9CA3AF", // Light gray for subtitle
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // White for emphasis
  },
  notificationBtn: {
    width: 45,
    height: 45,
    backgroundColor: "#1F2937", // Dark gray bg
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  availabilityCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111827", // Darker card bg
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  availabilityInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 16,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  quickLinksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  linkCard: {
    width: "48%",
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#1F2937",
    height: 110,
  },
  linkIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB", // Light gray
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  jobsList: {
    gap: 12,
  },
  jobCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  jobInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#D1D5DB",
  },
  jobClient: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  jobService: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  jobRight: {
    alignItems: "flex-end",
  },
  jobPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  jobStatus: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  logoutBtn: {
    marginVertical: 24,
    alignItems: "center",
    padding: 16,
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
