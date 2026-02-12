import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import { providerAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

const Portfolio = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async (isRefresh = false) => {
        try {
            if (!isRefresh) setLoading(true);
            else setRefreshing(true);

            const res = await providerAPI.getPortfolio();
            if (res.success) {
                setPortfolioItems(res.portfolio || []);
            }
        } catch (error) {
            console.error("Fetch portfolio error:", error);
            Alert.alert("Error", "Failed to load portfolio items.");
        } finally {
            if (!isRefresh) setLoading(false);
            else setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        fetchPortfolio(true);
    }, []);

    const pickMedia = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need access to your gallery to upload portfolio items.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            uploadMedia(result.assets[0]);
        }
    };

    const uploadMedia = async (asset: any) => {
        try {
            setUploading(true);
            const formData = new FormData();

            const filename = asset.uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename || '');
            const type = asset.type === 'video' ? 'video/mp4' : (match ? `image/${match[1]}` : `image/jpeg`);

            // @ts-ignore
            formData.append('file', {
                uri: asset.uri,
                name: filename || 'portfolio_item',
                type,
            });

            // You can add title/description if your form allows
            formData.append('title', 'Portfolio Item');
            formData.append('description', '');

            const res = await providerAPI.addPortfolioItem(formData);
            if (res.success) {
                Alert.alert("Success", "Portfolio item added successfully!");
                fetchPortfolio();
            }
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", "Failed to upload portfolio item.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to remove this from your portfolio?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res = await providerAPI.deletePortfolioItem(id);
                            if (res.success) {
                                fetchPortfolio();
                            }
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete item.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScreenWrapper bg={"#030712"}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Portfolio</Text>
                <TouchableOpacity
                    style={[styles.addButton, uploading && { opacity: 0.5 }]}
                    onPress={pickMedia}
                    disabled={uploading}
                >
                    {uploading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons name="add" size={24} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : portfolioItems.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="camera-burst" size={80} color="#1F2937" />
                    <Text style={styles.emptyTitle}>Empty Portfolio</Text>
                    <Text style={styles.emptyText}>Showcase your work by adding photos or videos of your completed projects.</Text>
                    <TouchableOpacity
                        style={styles.createBtn}
                        onPress={pickMedia}
                    >
                        <Text style={styles.createBtnText}>Upload Your First Work</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                    }
                >
                    <View style={styles.grid}>
                        {portfolioItems.map((item) => (
                            <View key={item.id} style={styles.itemCard}>
                                <Image
                                    source={{ uri: item.mediaUrl.startsWith('http') ? item.mediaUrl : `https://sillconnect-backend.onrender.com/${item.mediaUrl}` }}
                                    style={styles.itemMedia}
                                />
                                {item.mediaType === 'VIDEO' && (
                                    <View style={styles.playIconOverlay}>
                                        <Ionicons name="play-circle" size={40} color="rgba(255,255,255,0.8)" />
                                    </View>
                                )}
                                <TouchableOpacity
                                    style={styles.deleteBtn}
                                    onPress={() => handleDelete(item.id)}
                                >
                                    <Ionicons name="trash" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <View style={{ height: 80 }} />
                </ScrollView>
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
    backButton: {
        padding: 5,
    },
    addButton: {
        backgroundColor: '#3B82F6',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
    },
    itemCard: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH * 1.2,
        backgroundColor: '#111827',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#1F2937',
        position: 'relative',
    },
    itemMedia: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    playIconOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    deleteBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
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
    emptyText: {
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    createBtn: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 12,
    },
    createBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Portfolio;
