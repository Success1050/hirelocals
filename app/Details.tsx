import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { certificates, professional, reviews, workPhotos } from "@/mockData";
import { styles } from "@/styles/userStyles/detailsStyle";

const { width } = Dimensions.get("window");

export default function ProfessionalDetailScreen({ navigation }: any) {
  const [selectedTab, setSelectedTab] = useState("portfolio");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleImagePress = (url: string) => {
    setSelectedImage(url);
    setShowImageModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Professional Profile</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#EF4444" : "#fff"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.largeEmoji}>{professional.emoji}</Text>
              {professional.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={28} color="#3B82F6" />
                </View>
              )}
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>{professional.name}</Text>
              <Text style={styles.heroService}>{professional.service}</Text>
              <View style={styles.heroLocation}>
                <Ionicons name="location" size={16} color="#9CA3AF" />
                <Text style={styles.locationText}>{professional.location}</Text>
              </View>
              <View style={styles.availabilityContainer}>
                <View style={styles.availabilityDot} />
                <Text style={styles.availabilityText}>
                  {professional.availability}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.quickStatsGrid}>
            <View style={styles.quickStatCard}>
              <Ionicons name="star" size={20} color="#FBBF24" />
              <Text style={styles.quickStatValue}>{professional.rating}</Text>
              <Text style={styles.quickStatLabel}>Rating</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Ionicons name="briefcase" size={20} color="#3B82F6" />
              <Text style={styles.quickStatValue}>{professional.jobs}</Text>
              <Text style={styles.quickStatLabel}>Jobs</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Ionicons name="chatbubbles" size={20} color="#10B981" />
              <Text style={styles.quickStatValue}>{professional.reviews}</Text>
              <Text style={styles.quickStatLabel}>Reviews</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Ionicons name="checkmark-done" size={20} color="#8B5CF6" />
              <Text style={styles.quickStatValue}>
                {professional.completionRate}
              </Text>
              <Text style={styles.quickStatLabel}>Complete</Text>
            </View>
          </View>

          {/* Rate Section */}
          <View style={styles.rateSection}>
            <View style={styles.rateLeft}>
              <Text style={styles.rateLabel}>Starting Rate</Text>
              <Text style={styles.rateValue}>{professional.rate}</Text>
            </View>
            <TouchableOpacity style={styles.hireButton}>
              <Text style={styles.hireButtonText}>Hire Now</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "portfolio" && styles.tabActive,
            ]}
            onPress={() => setSelectedTab("portfolio")}
          >
            <Ionicons
              name="grid"
              size={20}
              color={selectedTab === "portfolio" ? "#3B82F6" : "#9CA3AF"}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === "portfolio" && styles.tabTextActive,
              ]}
            >
              Portfolio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === "about" && styles.tabActive]}
            onPress={() => setSelectedTab("about")}
          >
            <Ionicons
              name="information-circle"
              size={20}
              color={selectedTab === "about" ? "#3B82F6" : "#9CA3AF"}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === "about" && styles.tabTextActive,
              ]}
            >
              About
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === "reviews" && styles.tabActive]}
            onPress={() => setSelectedTab("reviews")}
          >
            <Ionicons
              name="star"
              size={20}
              color={selectedTab === "reviews" ? "#3B82F6" : "#9CA3AF"}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === "reviews" && styles.tabTextActive,
              ]}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Portfolio Tab */}
        {selectedTab === "portfolio" && (
          <View style={styles.portfolioSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Work</Text>
              <Text style={styles.sectionCount}>
                {workPhotos.length} projects
              </Text>
            </View>

            {/* Masonry Grid Layout */}
            <View style={styles.portfolioGrid}>
              <View style={styles.portfolioColumn}>
                {workPhotos
                  .filter((_, i) => i % 2 === 0)
                  .map((photo) => (
                    <TouchableOpacity
                      key={photo.id}
                      style={styles.portfolioCard}
                      onPress={() => handleImagePress(photo.url)}
                    >
                      <View style={styles.portfolioImage}>
                        <Text style={styles.portfolioEmoji}>{photo.url}</Text>
                      </View>
                      <View style={styles.portfolioInfo}>
                        <Text style={styles.portfolioTitle}>{photo.title}</Text>
                        <View style={styles.portfolioMeta}>
                          <Text style={styles.portfolioDate}>{photo.date}</Text>
                          <View style={styles.portfolioLikes}>
                            <Ionicons name="heart" size={12} color="#EF4444" />
                            <Text style={styles.portfolioLikeCount}>
                              {photo.likes}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>

              <View style={styles.portfolioColumn}>
                {workPhotos
                  .filter((_, i) => i % 2 === 1)
                  .map((photo) => (
                    <TouchableOpacity
                      key={photo.id}
                      style={styles.portfolioCard}
                      onPress={() => handleImagePress(photo.url)}
                    >
                      <View style={styles.portfolioImage}>
                        <Text style={styles.portfolioEmoji}>{photo.url}</Text>
                      </View>
                      <View style={styles.portfolioInfo}>
                        <Text style={styles.portfolioTitle}>{photo.title}</Text>
                        <View style={styles.portfolioMeta}>
                          <Text style={styles.portfolioDate}>{photo.date}</Text>
                          <View style={styles.portfolioLikes}>
                            <Ionicons name="heart" size={12} color="#EF4444" />
                            <Text style={styles.portfolioLikeCount}>
                              {photo.likes}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          </View>
        )}

        {/* About Tab */}
        {selectedTab === "about" && (
          <View style={styles.aboutSection}>
            {/* About Me */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.aboutText}>{professional.about}</Text>
            </View>

            {/* Skills */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills & Expertise</Text>
              <View style={styles.skillsGrid}>
                {professional.skills.map((skill, index) => (
                  <View key={index} style={styles.skillBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#10B981"
                    />
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Certifications */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {certificates.map((cert) => (
                <View key={cert.id} style={styles.certCard}>
                  <View style={styles.certIcon}>
                    <Ionicons name="ribbon" size={24} color="#F59E0B" />
                  </View>
                  <View style={styles.certInfo}>
                    <View style={styles.certHeader}>
                      <Text style={styles.certTitle}>{cert.title}</Text>
                      {cert.verified && (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#10B981"
                        />
                      )}
                    </View>
                    <Text style={styles.certIssuer}>{cert.issuer}</Text>
                    <Text style={styles.certYear}>Issued {cert.year}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Languages */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <View style={styles.languagesContainer}>
                {professional.languages.map((lang, index) => (
                  <View key={index} style={styles.languageBadge}>
                    <Ionicons name="globe-outline" size={16} color="#3B82F6" />
                    <Text style={styles.languageText}>{lang}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Additional Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={20} color="#9CA3AF" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Response Time</Text>
                    <Text style={styles.infoValue}>
                      {professional.responseTime}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Member Since</Text>
                    <Text style={styles.infoValue}>
                      {professional.memberSince}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Reviews Tab */}
        {selectedTab === "reviews" && (
          <View style={styles.reviewsSection}>
            {/* Rating Summary */}
            <View style={styles.ratingCard}>
              <View style={styles.ratingLeft}>
                <Text style={styles.ratingNumber}>{professional.rating}</Text>
                <View style={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={
                        i < Math.floor(professional.rating)
                          ? "star"
                          : "star-outline"
                      }
                      size={16}
                      color="#FBBF24"
                    />
                  ))}
                </View>
                <Text style={styles.ratingCount}>
                  {professional.reviews} reviews
                </Text>
              </View>
              <View style={styles.ratingRight}>
                <View style={styles.ratingBar}>
                  <Text style={styles.ratingLabel}>5⭐</Text>
                  <View style={styles.barContainer}>
                    <View style={[styles.barFill, { width: "85%" }]} />
                  </View>
                  <Text style={styles.ratingPercent}>85%</Text>
                </View>
                <View style={styles.ratingBar}>
                  <Text style={styles.ratingLabel}>4⭐</Text>
                  <View style={styles.barContainer}>
                    <View style={[styles.barFill, { width: "10%" }]} />
                  </View>
                  <Text style={styles.ratingPercent}>10%</Text>
                </View>
                <View style={styles.ratingBar}>
                  <Text style={styles.ratingLabel}>3⭐</Text>
                  <View style={styles.barContainer}>
                    <View style={[styles.barFill, { width: "3%" }]} />
                  </View>
                  <Text style={styles.ratingPercent}>3%</Text>
                </View>
                <View style={styles.ratingBar}>
                  <Text style={styles.ratingLabel}>2⭐</Text>
                  <View style={styles.barContainer}>
                    <View style={[styles.barFill, { width: "1%" }]} />
                  </View>
                  <Text style={styles.ratingPercent}>1%</Text>
                </View>
                <View style={styles.ratingBar}>
                  <Text style={styles.ratingLabel}>1⭐</Text>
                  <View style={styles.barContainer}>
                    <View style={[styles.barFill, { width: "1%" }]} />
                  </View>
                  <Text style={styles.ratingPercent}>1%</Text>
                </View>
              </View>
            </View>

            {/* Reviews List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewLeft}>
                      <Text style={styles.reviewEmoji}>{review.emoji}</Text>
                      <View>
                        <Text style={styles.reviewName}>{review.name}</Text>
                        <View style={styles.reviewStars}>
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
                  <View style={styles.reviewFooter}>
                    <TouchableOpacity style={styles.helpfulButton}>
                      <Ionicons
                        name="thumbs-up-outline"
                        size={14}
                        color="#9CA3AF"
                      />
                      <Text style={styles.helpfulText}>
                        Helpful ({review.helpful})
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.messageButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Image Modal */}
      <Modal
        visible={showImageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setShowImageModal(false)}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          <View style={styles.modalImageContainer}>
            <Text style={styles.modalEmoji}>{selectedImage}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
