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
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";

const Profile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Mock Data
  const [fullName, setFullName] = useState("Emeka Okafor");
  const [service, setService] = useState("Expert Plumber");
  const [hourlyRate, setHourlyRate] = useState("5000");
  const [location, setLocation] = useState("Lekki, Lagos");
  const [bio, setBio] = useState(
    "Professional plumber with 8+ years experience. Specialized in residential and commercial plumbing. Quick response and quality work guaranteed."
  );
  const [phone, setPhone] = useState("08012345678");
  const [skills, setSkills] = useState(
    "Pipe Installation, Leak Repairs, Drain Cleaning, Water Heater"
  );
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Profile updated successfully!");
    }, 1000);
  };

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
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatarPlaceholder}>{fullName.charAt(0) || "U"}</Text>
            )}
          </View>
          <Text style={styles.avatarHint}>Profile pictures can be managed in settings (Coming Soon)</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Professional Title / Service</Text>
          <TextInput
            style={styles.input}
            value={service}
            onChangeText={setService}
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
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g. 08012345678"
              placeholderTextColor="#6B7280"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Lekki, Lagos"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Skills (Comma separated)</Text>
          <TextInput
            style={styles.input}
            value={skills}
            onChangeText={setSkills}
            placeholder="e.g. Pipe Repair, Installation, Leakage"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>About / Bio</Text>
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
});

