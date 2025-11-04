import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Professional {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  jobs: number;
  rate: string;
  hourlyRate: number;
  emoji: string;
  location: string;
  availability: string;
  skills: string[];
  about: string;
  verified: boolean;
  responseTime: string;
}

export default function HireScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const professional: Professional = {
    id: 2,
    name: "Emeka Okafor",
    service: "Plumber",
    rating: 4.8,
    reviews: 156,
    jobs: 203,
    rate: "₦8,000/job",
    hourlyRate: 8000,
    emoji: "👨🏿‍🔧",
    location: "Lekki, Lagos",
    availability: "Available Today",
    skills: [
      "Pipe Installation",
      "Leak Repairs",
      "Drain Cleaning",
      "Water Heater",
    ],
    about:
      "Professional plumber with 8+ years experience. Specialized in residential and commercial plumbing. Quick response and quality work guaranteed.",
    verified: true,
    responseTime: "~10 mins",
  };

  const dates = [
    { id: 1, day: "Mon", date: "4", month: "Nov" },
    { id: 2, day: "Tue", date: "5", month: "Nov" },
    { id: 3, day: "Wed", date: "6", month: "Nov" },
    { id: 4, day: "Thu", date: "7", month: "Nov" },
    { id: 5, day: "Fri", date: "8", month: "Nov" },
  ];

  const times = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  const reviews = [
    {
      id: 1,
      name: "Tunde Adeyemi",
      rating: 5,
      comment: "Excellent work! Very professional and punctual.",
      date: "2 days ago",
      emoji: "👨🏿",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Fixed my kitchen sink perfectly. Highly recommend!",
      date: "1 week ago",
      emoji: "👩🏿",
    },
    {
      id: 3,
      name: "Chidi Okonkwo",
      rating: 4,
      comment: "Good service, fair pricing.",
      date: "2 weeks ago",
      emoji: "👨🏿",
    },
  ];

  const handleBookNow = () => {
    if (selectedDate && selectedTime && jobDescription) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmBooking = () => {
    setShowConfirmModal(false);
    // Navigate to booking confirmation or success screen
    alert("Booking Confirmed! You will receive a confirmation shortly.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hire Professional</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Professional Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileLeft}>
              <Text style={styles.profileEmoji}>{professional.emoji}</Text>
              <View>
                <View style={styles.nameContainer}>
                  <Text style={styles.profileName}>{professional.name}</Text>
                  {professional.verified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#3B82F6"
                    />
                  )}
                </View>
                <Text style={styles.profileService}>
                  {professional.service}
                </Text>
                <TouchableOpacity onPress={() => router.push("/Details")}>
                  <Text>Move</Text>
                </TouchableOpacity>
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={14} color="#9CA3AF" />
                  <Text style={styles.locationText}>
                    {professional.location}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.profileRight}>
              <View style={styles.availabilityBadge}>
                <View style={styles.availabilityDot} />
                <Text style={styles.availabilityText}>
                  {professional.availability}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="star" size={18} color="#FBBF24" />
              </View>
              <View>
                <Text style={styles.statValue}>{professional.rating}</Text>
                <Text style={styles.statLabel}>
                  {professional.reviews} reviews
                </Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="briefcase" size={18} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.statValue}>{professional.jobs}</Text>
                <Text style={styles.statLabel}>Jobs Done</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="time" size={18} color="#10B981" />
              </View>
              <View>
                <Text style={styles.statValue}>
                  {professional.responseTime}
                </Text>
                <Text style={styles.statLabel}>Response</Text>
              </View>
            </View>
          </View>

          {/* Rate */}
          <View style={styles.rateContainer}>
            <Text style={styles.rateLabel}>Starting Rate</Text>
            <Text style={styles.rateValue}>{professional.rate}</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{professional.about}</Text>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills & Expertise</Text>
          <View style={styles.skillsContainer}>
            {professional.skills.map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
          >
            {dates.map((date) => (
              <TouchableOpacity
                key={date.id}
                style={[
                  styles.dateCard,
                  selectedDate === `${date.day}-${date.date}` &&
                    styles.dateCardSelected,
                ]}
                onPress={() => setSelectedDate(`${date.day}-${date.date}`)}
              >
                <Text
                  style={[
                    styles.dateDay,
                    selectedDate === `${date.day}-${date.date}` &&
                      styles.dateTextSelected,
                  ]}
                >
                  {date.day}
                </Text>
                <Text
                  style={[
                    styles.dateNumber,
                    selectedDate === `${date.day}-${date.date}` &&
                      styles.dateTextSelected,
                  ]}
                >
                  {date.date}
                </Text>
                <Text
                  style={[
                    styles.dateMonth,
                    selectedDate === `${date.day}-${date.date}` &&
                      styles.dateTextSelected,
                  ]}
                >
                  {date.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {times.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeCard,
                  selectedTime === time && styles.timeCardSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.timeTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe the work you need done..."
            placeholderTextColor="#6B7280"
            multiline
            numberOfLines={4}
            value={jobDescription}
            onChangeText={setJobDescription}
          />
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>
              Reviews ({professional.reviews})
            </Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewLeft}>
                  <Text style={styles.reviewEmoji}>{review.emoji}</Text>
                  <View>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <View style={styles.reviewRating}>
                      {[...Array(review.rating)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name="star"
                          size={12}
                          color="#FBBF24"
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.priceValue}>
            ₦{professional.hourlyRate.toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedDate || !selectedTime || !jobDescription) &&
              styles.bookButtonDisabled,
          ]}
          onPress={handleBookNow}
          disabled={!selectedDate || !selectedTime || !jobDescription}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Booking</Text>
              <TouchableOpacity onPress={() => setShowConfirmModal(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View style={styles.confirmSection}>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Professional</Text>
                <Text style={styles.confirmValue}>{professional.name}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Service</Text>
                <Text style={styles.confirmValue}>{professional.service}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Date & Time</Text>
                <Text style={styles.confirmValue}>
                  {selectedDate} at {selectedTime}
                </Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Total Amount</Text>
                <Text style={styles.confirmPrice}>
                  ₦{professional.hourlyRate.toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmBooking}
              >
                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#030712",
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  shareButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    margin: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileLeft: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },
  profileEmoji: {
    fontSize: 48,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  profileService: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  profileRight: {
    alignItems: "flex-end",
  },
  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#064E3B",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    backgroundColor: "#10B981",
    borderRadius: 3,
  },
  availabilityText: {
    fontSize: 11,
    color: "#6EE7B7",
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: "#1F2937",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#1F2937",
  },
  rateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rateLabel: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  rateValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: "#D1D5DB",
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  skillText: {
    fontSize: 13,
    color: "#E5E7EB",
  },
  dateScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  dateCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginRight: 12,
    minWidth: 80,
  },
  dateCardSelected: {
    backgroundColor: "#1E3A8A",
    borderColor: "#3B82F6",
  },
  dateDay: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  dateTextSelected: {
    color: "#fff",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: "30%",
    alignItems: "center",
  },
  timeCardSelected: {
    backgroundColor: "#1E3A8A",
    borderColor: "#3B82F6",
  },
  timeText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  timeTextSelected: {
    color: "#fff",
  },
  textArea: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 16,
    padding: 16,
    color: "#fff",
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: "top",
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    color: "#3B82F6",
  },
  reviewCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reviewLeft: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },
  reviewEmoji: {
    fontSize: 36,
  },
  reviewName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: "row",
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  reviewComment: {
    fontSize: 14,
    color: "#D1D5DB",
    lineHeight: 20,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#111827",
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  bookButton: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  bookButtonDisabled: {
    backgroundColor: "#374151",
    opacity: 0.5,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#111827",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  confirmSection: {
    backgroundColor: "#1F2937",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  confirmLabel: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  confirmValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  confirmPrice: {
    fontSize: 18,
    color: "#3B82F6",
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#1F2937",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
