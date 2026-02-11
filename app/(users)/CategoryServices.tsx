import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    FlatList,
    Image,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import { userAPI } from '@/lib/api';

const CategoryServices = () => {
    const router = useRouter();
    const { id, name } = useLocalSearchParams();
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (id) {
            fetchServices();
        }
    }, [id]);

    const fetchServices = async (isRefresh = false) => {
        try {
            if (!isRefresh) setLoading(true);
            else setRefreshing(true);

            const res = await userAPI.getAllServices({ categoryId: id as string });
            if (res.success) {
                setServices(res.services);
            }
        } catch (error) {
            console.error("Fetch category services error:", error);
        } finally {
            if (!isRefresh) setLoading(false);
            else setRefreshing(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        fetchServices(true);
    }, [id]);

    const renderServiceCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => router.push({ pathname: '/Details', params: { id: item.id } })}
        >
            <View style={styles.imageContainer}>
                {item.images?.[0] ? (
                    <Image
                        source={{ uri: item.images[0].mediaUrl.startsWith('http') ? item.images[0].mediaUrl : `https://sillconnect-backend.onrender.com/${item.images[0].mediaUrl}` }}
                        style={styles.serviceImage}
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="image-outline" size={40} color="#374151" />
                    </View>
                )}
                <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>₦{item.price}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <Text style={styles.serviceTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.providerName}>
                    by {item.provider?.providerProfile?.businessName || `${item.provider?.firstName} ${item.provider?.lastName}`}
                </Text>

                <View style={styles.statsRow}>
                    <View style={styles.ratingBox}>
                        <Ionicons name="star" size={14} color="#FBBF24" />
                        <Text style={styles.ratingText}>{item.provider?.providerProfile?.averageRating || '5.0'}</Text>
                    </View>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.durationText}>{item.duration || '60'} mins</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper bg={"#030712"}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{name || 'Category Services'}</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={styles.loadingText}>Finding best services...</Text>
                </View>
            ) : services.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="search-outline" size={80} color="#1F2937" />
                    <Text style={styles.emptyTitle}>No Services Found</Text>
                    <Text style={styles.emptySubtitle}>We couldn't find any services in this category yet. Check back later!</Text>
                    <TouchableOpacity style={styles.goBackBtn} onPress={() => router.back()}>
                        <Text style={styles.goBackText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={services}
                    renderItem={renderServiceCard}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                />
            )}
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    backBtn: {
        padding: 5,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#9CA3AF',
        marginTop: 10,
    },
    listContainer: {
        padding: 15,
        gap: 15,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        gap: 15,
    },
    serviceCard: {
        backgroundColor: '#111827',
        borderRadius: 16,
        width: '47.5%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    imageContainer: {
        height: 120,
        position: 'relative',
    },
    serviceImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1F2937',
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priceText: {
        color: '#FBBF24',
        fontWeight: 'bold',
        fontSize: 12,
    },
    cardContent: {
        padding: 12,
    },
    serviceTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    providerName: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        color: '#FBBF24',
        fontSize: 12,
        fontWeight: '600',
    },
    dot: {
        color: '#4B5563',
        marginHorizontal: 6,
    },
    durationText: {
        color: '#6B7280',
        fontSize: 11,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        marginBottom: 10,
    },
    emptySubtitle: {
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 30,
    },
    goBackBtn: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
    },
    goBackText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});

export default CategoryServices;
