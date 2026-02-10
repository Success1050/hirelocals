import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import apiClient, { providerAPI } from "@/lib/api";

const ProviderOnboarding = () => {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form State
    const [businessName, setBusinessName] = useState("");
    const [bio, setBio] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");

    // Categories State
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await providerAPI.getCategories();
            if (res.success) {
                setCategories(res.categories);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const toggleCategory = (id: string) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(prev => prev.filter(c => c !== id));
        } else {
            setSelectedCategories(prev => [...prev, id]);
        }
    };

    const handleSubmit = async () => {
        if (!businessName || !bio || !yearsOfExperience || !hourlyRate) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        if (selectedCategories.length === 0) {
            Alert.alert("Error", "Please select at least one category/skill.");
            return;
        }

        setLoading(true);

        try {
            // 1. Create Provider Profile
            const profileData = {
                businessName,
                bio,
                yearsOfExperience: parseInt(yearsOfExperience),
                hourlyRate: parseFloat(hourlyRate),
                availabilityStatus: "AVAILABLE",
                instantBooking: false,
                categories: selectedCategories
            };

            const profileResponse = await apiClient.post("/api/providers", profileData);

            if (!profileResponse.data.success) {
                throw new Error(profileResponse.data.message || "Failed to create profile");
            }

            // Update local user context to reflect changes
            await refreshUser();

            Alert.alert("Success", "Provider profile created!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/(professionals)/ProfessionalDashboard"),
                },
            ]);
        } catch (error: any) {
            console.error("Onboarding Error:", error);
            const msg = error?.response?.data?.message || error.message || "Something went wrong";
            Alert.alert("Error", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Complete Your Profile</Text>
                    <Text style={styles.subtitle}>
                        Tell us about your business to start receiving jobs.
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Business Name / Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. John's Plumbing Services"
                            placeholderTextColor="#9ca3af"
                            value={businessName}
                            onChangeText={setBusinessName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio / Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe your experience and what you offer..."
                            placeholderTextColor="#9ca3af"
                            multiline
                            numberOfLines={4}
                            value={bio}
                            onChangeText={setBio}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                            <Text style={styles.label}>Years of Exp.</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 5"
                                placeholderTextColor="#9ca3af"
                                keyboardType="numeric"
                                value={yearsOfExperience}
                                onChangeText={setYearsOfExperience}
                            />
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Hourly Rate (₦)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 5000"
                                placeholderTextColor="#9ca3af"
                                keyboardType="numeric"
                                value={hourlyRate}
                                onChangeText={setHourlyRate}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Select Services / Categories</Text>
                        {loadingCategories ? (
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        ) : (
                            <View style={styles.categoriesContainer}>
                                {categories.map((cat) => (
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
                        )}
                        {categories.length === 0 && !loadingCategories && (
                            <Text style={styles.helperText}>No categories found.</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Verification</Text>
                        <Text style={styles.helperText}>Government ID verification will be required later in settings.</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Complete Setup</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ProviderOnboarding;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff", // or theme.colors.background
        padding: 20,
        justifyContent: "center",
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#6b7280",
    },
    form: {
        width: "100%",
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: "#1f2937",
    },
    textArea: {
        minHeight: 120,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    helperText: {
        fontSize: 12,
        color: "#6b7280",
        fontStyle: 'italic'
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
        backgroundColor: "#f3f4f6",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    categoryChipSelected: {
        backgroundColor: theme.colors.primary + "20", // 20% opacity
        borderColor: theme.colors.primary,
    },
    categoryText: {
        fontSize: 14,
        color: "#374151",
    },
    categoryTextSelected: {
        color: theme.colors.primary,
        fontWeight: "600",
    }
});
