import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";

import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const router = useRouter();
  const { logout, user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    await refreshUser();
    await loadProfile(true);
  }, [refreshUser]);

  // Profile State
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [travelRadius, setTravelRadius] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Categories/Skills
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);

  useEffect(() => {
    loadProfile();
    loadCategories();
  }, [user]);

  const loadCategories = async () => {
    try {
      const { providerAPI } = require('@/lib/api');
      const res = await providerAPI.getCategories();
      if (res.success) {
        setAvailableCategories(res.categories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadProfile = async (isRefresh = false) => {
    try {
      if (!isRefresh) setFetching(true);
      else setRefreshing(true);

      const { providerAPI } = require('@/lib/api');
      const res = await providerAPI.getProfile();

      if (res.success && res.provider) {
        const p = res.provider;
        setBusinessName(p.businessName || "");
        setTagline(p.tagline || "");
        setBio(p.bio || "");
        setHourlyRate(p.hourlyRate?.toString() || "");
        setYearsOfExperience(p.yearsOfExperience?.toString() || "");
        setTravelRadius(p.travelRadius?.toString() || "");
        setAddress(p.address || "");
        setProfileImage(
          p.profileImage
            ? p.profileImage.startsWith("http")
              ? p.profileImage
              : `https://sillconnect-backend.onrender.com/${p.profileImage}`
            : null
        );

        // Categories
        if (p.categories && Array.isArray(p.categories)) {
          setCategories(p.categories);
          setSelectedCategories(p.categories.map((c: any) => c.id));
        }

        // User data
        if (p.user) {
          setAddress(p.user.address || "");
          setProfileImage(p.user.profileImage ? (p.user.profileImage.startsWith('http') ? p.user.profileImage : `https://sillconnect-backend.onrender.com/${p.user.profileImage}`) : null);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      if (!isRefresh) setFetching(false);
      else setRefreshing(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  const handleImageUpload = async (uri: string) => {
    try {
      setUploadingImage(true);
      const { providerAPI } = require('@/lib/api');

      const formData = new FormData();
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('profileImage', {
        uri,
        name: filename,
        type
      } as any);

      // We use the same updateProfile endpoint as it handles profileImage in the backend
      const res = await providerAPI.updateProfile(formData);

      if (res.success) {
        setProfileImage(uri);
        await refreshUser();
        Alert.alert("Success", "Profile picture updated!");
      } else {
        Alert.alert("Error", res.message || "Failed to update profile picture");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!businessName || !hourlyRate) {
      Alert.alert("Validation", "Business Name and Hourly Rate are required.");
      return;
    }

    setLoading(true);
    try {
      const { providerAPI } = require('@/lib/api');

      const formData = new FormData();
      formData.append('businessName', businessName);
      formData.append('tagline', tagline);
      formData.append('bio', bio);
      formData.append('hourlyRate', hourlyRate);
      formData.append('yearsOfExperience', yearsOfExperience || '0');
      formData.append('travelRadius', travelRadius || '0');
      formData.append('categories', JSON.stringify(selectedCategories));

      const res = await providerAPI.updateProfile(formData);

      if (res.success) {
        Alert.alert("Success", "Profile updated successfully!");
        loadProfile();
      } else {
        Alert.alert("Error", res.message || "Failed to update profile");
      }

    } catch (error: any) {
      console.error("Update Error:", error);
      Alert.alert("Error", "An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(prev => prev.filter(c => c !== id));
    } else {
      setSelectedCategories(prev => [...prev, id]);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/auth/signin");
          },
        },
      ]
    );
  };

  if (fetching) {
    return (
      <ScreenWrapper bg={"#030712"}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg={"#030712"}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
        }
      >

        {/* Avatar Placeholder */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage} disabled={uploadingImage}>
            {uploadingImage ? (
              <ActivityIndicator size="large" color="#3B82F6" />
            ) : profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatarPlaceholder}>{user?.firstName?.charAt(0) || "U"}</Text>
            )}
            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap to change profile picture</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={styles.input}
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Enter your business name"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tagline (Short Bio)</Text>
          <TextInput
            style={styles.input}
            value={tagline}
            onChangeText={setTagline}
            placeholder="e.g. Expert Plumber"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Hourly Rate (₦)</Text>
            <TextInput
              style={styles.input}
              value={hourlyRate}
              onChangeText={setHourlyRate}
              placeholder="e.g. 5000"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Years of Exp.</Text>
            <TextInput
              style={styles.input}
              value={yearsOfExperience}
              onChangeText={setYearsOfExperience}
              placeholder="e.g. 5"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Travel Radius (km)</Text>
          <TextInput
            style={styles.input}
            value={travelRadius}
            onChangeText={setTravelRadius}
            placeholder="e.g. 20"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Services / Categories</Text>
          <View style={styles.categoriesContainer}>
            {availableCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategories.includes(cat.id) && styles.categoryChipSelected
                ]}
                onPress={() => toggleCategory(cat.id)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategories.includes(cat.id) && styles.categoryTextSelected
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Detailed Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell clients about your experience and expertise..."
            placeholderTextColor="#6B7280"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  backButton: {
    padding: 5,
  },
  saveText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "600",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3B82F6",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#030712",
  },
  avatarPlaceholder: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#9CA3AF",
  },
  avatarHint: {
    fontSize: 12,
    color: "#6B7280",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
  },
  categoryChipSelected: {
    backgroundColor: "rgba(59, 130, 246, 0.2)", // Blue tint
    borderColor: "#3B82F6",
  },
  categoryText: {
    fontSize: 14,
    color: "#fff",
  },
  categoryTextSelected: {
    color: "#3B82F6",
    fontWeight: "600",
  },
});

