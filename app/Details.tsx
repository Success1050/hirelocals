import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { userAPI } from "@/lib/api";

const { width } = Dimensions.get("window");

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  const fetchServiceDetails = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(false);
      const res = await userAPI.getServiceById(id as string);
      if (res.success) {
        setService(res.service);
      }
    } catch (err: any) {
      console.error("Fetch service details error:", err);
      // Retry once after 2s if it's a network error (backend cold start)
      if (!err?.response && retryCount < 2) {
        await new Promise(r => setTimeout(r, 2000));
        return fetchServiceDetails(retryCount + 1);
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#030712", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ color: "#9CA3AF", marginTop: 10 }}>Loading service details...</Text>
      </View>
    );
  }

  if (error || !service) {
    return (
      <View style={{ flex: 1, backgroundColor: "#030712", justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Ionicons name="cloud-offline-outline" size={60} color="#374151" />
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", marginTop: 15 }}>
          {error ? "Couldn't load service" : "Service not found"}
        </Text>
        <Text style={{ color: "#9CA3AF", textAlign: "center", marginTop: 8 }}>
          {error ? "The server might be waking up. Try again in a moment." : "This service may no longer be available."}
        </Text>
        <View style={{ flexDirection: "row", gap: 15, marginTop: 20 }}>
          {error && (
            <TouchableOpacity
              onPress={() => fetchServiceDetails()}
              style={{ backgroundColor: "#3B82F6", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Retry</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
            <Text style={{ color: "#3B82F6", fontWeight: "bold" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const BASE_URL = 'https://sillconnect-backend.onrender.com/';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Details</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          {service.images && service.images.length > 0 ? (
            <>
              <Image
                source={{ uri: service.images[activeImageIndex].mediaUrl.startsWith('http') ? service.images[activeImageIndex].mediaUrl : `${BASE_URL}${service.images[activeImageIndex].mediaUrl}` }}
                style={styles.mainImage}
                resizeMode="cover"
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailList}>
                {service.images.map((img: any, index: number) => (
                  <TouchableOpacity
                    key={img.id}
                    onPress={() => setActiveImageIndex(index)}
                    style={[styles.thumbnailContainer, activeImageIndex === index && styles.activeThumbnail]}
                  >
                    <Image
                      source={{ uri: img.mediaUrl.startsWith('http') ? img.mediaUrl : `${BASE_URL}${img.mediaUrl}` }}
                      style={styles.thumbnail}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : (
            <View style={styles.noImagePlaceholder}>
              <Ionicons name="image-outline" size={80} color="#1F2937" />
              <Text style={{ color: '#4B5563', marginTop: 10 }}>No images available</Text>
            </View>
          )}
        </View>

        {/* Service Info */}
        <View style={styles.infoSection}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{service.category?.name}</Text>
          </View>
          <Text style={styles.title}>{service.title}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price starting from</Text>
            <Text style={styles.priceValue}>₦{service.price}</Text>
          </View>

          <View style={styles.line} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{service.description}</Text>

          {service.duration && (
            <View style={styles.featRow}>
              <Ionicons name="time-outline" size={20} color="#3B82F6" />
              <Text style={styles.featText}>Approx. Duration: {service.duration} mins</Text>
            </View>
          )}
        </View>

        {/* Provider Section */}
        <TouchableOpacity
          style={styles.providerCard}
          onPress={() => router.push({
            pathname: '/(users)/ProviderProfile',
            params: { id: service.provider?.providerProfile?.id }
          })}
        >
          <View style={styles.providerLeft}>
            <View style={styles.providerAvatar}>
              {service.provider?.profileImage ? (
                <Image
                  source={{ uri: service.provider.profileImage.startsWith('http') ? service.provider.profileImage : `${BASE_URL}${service.provider.profileImage}` }}
                  style={styles.avatarImg}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{service.provider?.firstName?.[0]}</Text>
                </View>
              )}
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>
                {service.provider?.providerProfile?.businessName || `${service.provider?.firstName} ${service.provider?.lastName}`}
              </Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FBBF24" />
                <Text style={styles.ratingValue}>{service.provider?.providerProfile?.averageRating || '5.0'}</Text>
                <Text style={styles.reviewCount}>({service.provider?.providerProfile?.totalReviews || 0} reviews)</Text>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#4B5563" />
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Booking Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceTag}>
          <Text style={styles.bottomPriceLabel}>Total Price</Text>
          <Text style={styles.bottomPriceValue}>₦{service.price}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
          <Ionicons name="calendar" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  headerButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#111827",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  imageGallery: {
    width: width,
    height: 350,
    backgroundColor: "#111827",
  },
  mainImage: {
    width: "100%",
    height: 280,
  },
  thumbnailList: {
    padding: 10,
  },
  thumbnailContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeThumbnail: {
    borderColor: "#3B82F6",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  noImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  infoSection: {
    padding: 20,
  },
  categoryBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  categoryText: {
    color: "#3B82F6",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  priceValue: {
    color: "#FBBF24",
    fontSize: 22,
    fontWeight: "bold",
  },
  line: {
    height: 1,
    backgroundColor: "#1F2937",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  description: {
    color: "#9CA3AF",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 20,
  },
  featRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featText: {
    color: "#D1D5DB",
    fontSize: 14,
  },
  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111827",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  providerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  providerInfo: {
    gap: 2,
  },
  providerName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingValue: {
    color: "#FBBF24",
    fontSize: 14,
    fontWeight: "600",
  },
  reviewCount: {
    color: "#6B7280",
    fontSize: 12,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    paddingBottom: 30,
  },
  priceTag: {
    gap: 2,
  },
  bottomPriceLabel: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  bottomPriceValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  bookButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
