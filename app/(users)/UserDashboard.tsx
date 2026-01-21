import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { featuredPros, recentBookings, services } from "@/mockData";
import { styles } from "@/styles/userStyles/style";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("home");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return { bg: "#064E3B", text: "#6EE7B7" };
      case "In Progress":
        return { bg: "#1E3A8A", text: "#93C5FD" };
      case "Scheduled":
        return { bg: "#581C87", text: "#C084FC" };
      default:
        return { bg: "#1F2937", text: "#9CA3AF" };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="briefcase" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.logoText}>SkillHire</Text>
              <Text style={styles.logoSubtext}>Find skilled professionals</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#D1D5DB"
              />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="person-outline" size={24} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services or professionals..."
            placeholderTextColor="#6B7280"
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back! 👋</Text>
          <Text style={styles.welcomeSubtitle}>
            Find the perfect professional for your needs
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: "#2563EB" }]}>
            <View style={styles.statHeader}>
              <Ionicons name="time-outline" size={20} color="#BFDBFE" />
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statSubtext}>Bookings</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#9333EA" }]}>
            <View style={styles.statHeader}>
              <Ionicons name="star" size={20} color="#E9D5FF" />
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statSubtext}>Jobs</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#059669" }]}>
            <View style={styles.statHeader}>
              <Ionicons name="trending-up" size={20} color="#A7F3D0" />
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <Text style={styles.statValue}>₦24k</Text>
            <Text style={styles.statSubtext}>This month</Text>
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Services</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <View
                  style={[
                    styles.serviceIcon,
                    { backgroundColor: service.color },
                  ]}
                >
                  <Ionicons name={service.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceJobs}>{service.jobs} available</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Professionals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Professionals</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {featuredPros.map((pro) => (
            <View key={pro.id} style={styles.proCard}>
              <Text style={styles.proEmoji}>{pro.emoji}</Text>
              <View style={styles.proInfo}>
                <Text style={styles.proName}>{pro.name}</Text>
                <Text style={styles.proService}>{pro.service}</Text>
                <View style={styles.proStats}>
                  <Ionicons name="star" size={14} color="#FBBF24" />
                  <Text style={styles.proRating}>{pro.rating}</Text>
                  <Text style={styles.proDivider}>•</Text>
                  <Text style={styles.proJobs}>{pro.jobs} jobs</Text>
                </View>
              </View>
              <View style={styles.proRight}>
                <Text style={styles.proRate}>{pro.rate}</Text>
                <TouchableOpacity style={styles.hireButton}>
                  <Text style={styles.hireButtonText}>Hire</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Bookings */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentBookings.map((booking) => {
            const statusColor = getStatusColor(booking.status);
            return (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingLeft}>
                  <Text style={styles.bookingEmoji}>{booking.emoji}</Text>
                  <View>
                    <Text style={styles.bookingName}>
                      {booking.professional}
                    </Text>
                    <Text style={styles.bookingService}>{booking.service}</Text>
                    <View style={styles.bookingRating}>
                      <Ionicons name="star" size={12} color="#FBBF24" />
                      <Text style={styles.bookingRatingText}>
                        {booking.rating}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bookingRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColor.bg },
                    ]}
                  >
                    <Text
                      style={[styles.statusText, { color: statusColor.text }]}
                    >
                      {booking.status}
                    </Text>
                  </View>
                  <Text style={styles.bookingDate}>{booking.date}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
    </SafeAreaView>
  );
}
