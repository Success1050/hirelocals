import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { featuredPros, recentBookings, services as mockServices } from "@/mockData";
import { styles } from "@/styles/userStyles/style";
import { useAuth } from "@/contexts/AuthContext";
import { userAPI } from "@/lib/api";

const customStyles = StyleSheet.create({
  horizontalServiceCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  serviceMainInfo: {
    flex: 1,
  },
  serviceTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  providerText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FBBF24',
  },
  bookBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default function UserDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [categories, setCategories] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      else setRefreshing(true);

      const [catRes, serRes] = await Promise.all([
        userAPI.getCategories(),
        userAPI.getAllServices(),
      ]);

      if (catRes.success) {
        setCategories(catRes.categories);
      }
      if (serRes.success) {
        setAllServices(serRes.services);
      }
    } catch (error) {
      console.error("Fetch dashboard data error:", error);
    } finally {
      if (!isRefresh) setLoading(false);
      else setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    fetchData(true);
  }, []);

  // Helper to count services per category
  const getServiceCount = (categoryId: string) => {
    return allServices.filter(s => s.categoryId === categoryId).length;
  };

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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Loading your personalized view...</Text>
      </View>
    );
  }

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

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Welcome back, {user?.firstName || "User"}! 👋
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Find the perfect professional for your needs
          </Text>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
          </View>

          <View style={styles.servicesGrid}>
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.serviceCard}
                onPress={() => router.push({
                  pathname: '/(users)/CategoryServices',
                  params: { id: cat.id, name: cat.name }
                })}
              >
                <View
                  style={[
                    styles.serviceIcon,
                    { backgroundColor: ["#2563EB", "#9333EA", "#059669", "#D97706", "#DC2626", "#4F46E5"][index % 6] },
                  ]}
                >
                  <Ionicons name="apps" size={24} color="#fff" />
                </View>
                <Text style={styles.serviceName}>{cat.name}</Text>
                <Text style={styles.serviceJobs}>{getServiceCount(cat.id)} services</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Services/Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Services</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {allServices.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#9CA3AF' }}>No services available right now.</Text>
            </View>
          ) : (
            allServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={customStyles.horizontalServiceCard}
                onPress={() => router.push({ pathname: '/Details', params: { id: service.id } })}
              >
                {service.images?.[0] && (
                  <Image
                    source={{ uri: service.images[0].mediaUrl.startsWith('http') ? service.images[0].mediaUrl : `https://sillconnect-backend.onrender.com/${service.images[0].mediaUrl}` }}
                    style={customStyles.serviceImage}
                  />
                )}
                <View style={customStyles.serviceMainInfo}>
                  <Text style={customStyles.serviceTitleText}>{service.title}</Text>
                  <Text style={customStyles.providerText}>
                    by {service.provider?.providerProfile?.businessName || `${service.provider?.firstName} ${service.provider?.lastName}`}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Ionicons name="star" size={12} color="#FBBF24" />
                    <Text style={{ color: '#FBBF24', fontSize: 12, marginLeft: 4 }}>
                      {service.provider?.providerProfile?.averageRating || '5.0'}
                    </Text>
                  </View>
                  <Text style={customStyles.priceText}>₦{service.price}</Text>
                </View>
                <View style={customStyles.bookBtn}>
                  <Text style={customStyles.bookBtnText}>Book Now</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Featured Professionals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Professionals (Demo)</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {featuredPros.map((pro: any) => (
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
            <Text style={styles.sectionTitle}>Your Recent Activity (Demo)</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentBookings.map((booking: any) => {
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

