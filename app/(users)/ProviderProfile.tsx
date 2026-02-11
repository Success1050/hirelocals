import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
    StatusBar,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import { userAPI } from '@/lib/api';

const { width } = Dimensions.get('window');

const ProviderProfile = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams(); // ProviderProfile ID
    const [providerData, setProviderData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProviderProfile();
        }
    }, [id]);

    const fetchProviderProfile = async () => {
        try {
            setLoading(true);
            const res = await userAPI.getProviderById(id as string);
            if (res.success) {
                setProviderData(res.provider);
            }
        } catch (error) {
            console.error("Fetch provider profile error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (!providerData) {
        return (
            <View style={styles.center}>
                <Text style={{ color: '#fff' }}>Provider not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: '#3B82F6' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const BASE_URL = 'https://sillconnect-backend.onrender.com/';

    return (
        <ScreenWrapper bg={"#030712"}>
            <StatusBar barStyle="light-content" />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Provider Details</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        {providerData.user?.profileImage ? (
                            <Image
                                source={{ uri: providerData.user.profileImage.startsWith('http') ? providerData.user.profileImage : `${BASE_URL}${providerData.user.profileImage}` }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={[styles.avatar, styles.placeholderAvatar]}>
                                <Text style={styles.avatarInitials}>{providerData.user?.firstName?.[0]}</Text>
                            </View>
                        )}
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                        </View>
                    </View>

                    <Text style={styles.businessName}>{providerData.businessName || `${providerData.user?.firstName} ${providerData.user?.lastName}`}</Text>
                    <Text style={styles.tagline}>{providerData.tagline || 'Professional Service Provider'}</Text>

                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={16} color="#9CA3AF" />
                        <Text style={styles.locationText}>{providerData.user?.city}, {providerData.user?.state}</Text>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{providerData.averageRating || '5.0'}</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{providerData.totalReviews || 0}</Text>
                            <Text style={styles.statLabel}>Reviews</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{providerData.yearsOfExperience}+</Text>
                            <Text style={styles.statLabel}>Years Exp.</Text>
                        </View>
                    </View>
                </View>

                {/* Bio */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.bioText}>{providerData.bio || "No biography provided."}</Text>
                </View>

                {/* Portfolio - if any */}
                {providerData.portfolioItems && providerData.portfolioItems.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Portfolio</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.portfolioScroll}>
                            {providerData.portfolioItems.map((item: any) => (
                                <View key={item.id} style={styles.portfolioCard}>
                                    <Image
                                        source={{ uri: item.mediaUrl.startsWith('http') ? item.mediaUrl : `${BASE_URL}${item.mediaUrl}` }}
                                        style={styles.portfolioImage}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Other Services */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Services Offered</Text>
                    {providerData.services && providerData.services.length > 0 ? (
                        providerData.services.map((service: any) => (
                            <TouchableOpacity
                                key={service.id}
                                style={styles.serviceItem}
                                onPress={() => router.push({ pathname: '/Details', params: { id: service.id } })}
                            >
                                <View style={styles.serviceInfo}>
                                    <Text style={styles.serviceTitle}>{service.title}</Text>
                                    <Text style={styles.serviceCategory}>{service.category?.name}</Text>
                                </View>
                                <View style={styles.serviceRight}>
                                    <Text style={styles.servicePrice}>₦{service.price}</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#4B5563" />
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={{ color: '#4B5563', fontStyle: 'italic' }}>No other services listed.</Text>
                    )}
                </View>

                <View style={{ height: 50 }} />
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        backgroundColor: '#030712',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    iconBtn: {
        padding: 5,
    },
    container: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#111827',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#3B82F6',
    },
    placeholderAvatar: {
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        color: '#3B82F6',
        fontSize: 40,
        fontWeight: 'bold',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#030712',
        borderRadius: 12,
    },
    businessName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    tagline: {
        fontSize: 14,
        color: '#3B82F6',
        marginBottom: 10,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 25,
    },
    locationText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#111827',
        borderRadius: 16,
        paddingVertical: 15,
        width: width - 40,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    statBox: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: '#1F2937',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    bioText: {
        color: '#9CA3AF',
        fontSize: 15,
        lineHeight: 24,
    },
    portfolioScroll: {
        paddingRight: 20,
    },
    portfolioCard: {
        width: 150,
        height: 150,
        borderRadius: 12,
        marginRight: 15,
        overflow: 'hidden',
        backgroundColor: '#111827',
    },
    portfolioImage: {
        width: '100%',
        height: '100%',
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#111827',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    serviceInfo: {
        flex: 1,
    },
    serviceTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    serviceCategory: {
        color: '#3B82F6',
        fontSize: 12,
    },
    serviceRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    servicePrice: {
        color: '#FBBF24',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default ProviderProfile;
