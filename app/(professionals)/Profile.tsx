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
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Profile State
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [travelRadius, setTravelRadius] = useState("");
  const [address, setAddress] = useState("");

  // Categories/Skills
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);

  useEffect(() => {
    loadProfile();
    loadCategories();
  }, []);

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

  const loadProfile = async () => {
    try {
      setFetching(true);
      const { providerAPI } = require('@/lib/api');
      const res = await providerAPI.getProfile();

      if (res.success && res.profile) {
        const p = res.profile;
        setBusinessName(p.businessName || "");
        setTagline(p.tagline || "");
        setBio(p.bio || "");
        setHourlyRate(p.hourlyRate ? p.hourlyRate.toString() : "");
        setYearsOfExperience(p.yearsOfExperience ? p.yearsOfExperience.toString() : "");
        setTravelRadius(p.travelRadius ? p.travelRadius.toString() : "");

        // Categories
        if (p.categories && Array.isArray(p.categories)) {
          setCategories(p.categories);
          setSelectedCategories(p.categories.map((c: any) => c.id));
        }

        // Address (from user object nested in profile or direct user context)
        if (p.user) {
          setAddress(p.user.address || "");
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setFetching(false);
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

      const updateData = {
        businessName,
        tagline,
        bio,
        hourlyRate: parseFloat(hourlyRate),
        yearsOfExperience: parseInt(yearsOfExperience) || 0,
        travelRadius: parseFloat(travelRadius) || 0,
        categories: selectedCategories // Send array of IDs
      };

      const res = await providerAPI.updateProfile(updateData);

      if (res.success) {
        Alert.alert("Success", "Profile updated successfully!");
        // Reload to reflect any server-side processing
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {/* Avatar Placeholder */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatarPlaceholder}>{user?.firstName?.charAt(0) || "U"}</Text>
            )}
          </View>
          <Text style={styles.avatarHint}>Profile pictures can be managed in settings</Text>
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

