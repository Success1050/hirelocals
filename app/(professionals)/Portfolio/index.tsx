import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, FlatList, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import { providerAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_SIZE = (width - 40 - (COLUMN_COUNT - 1) * 10) / COLUMN_COUNT;

const Portfolio = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            setLoading(true);
            const res = await providerAPI.getPortfolio();
            if (res.success) {
                setItems(res.portfolio || []);
            }
        } catch (error) {
            console.error("Fetch portfolio error:", error);
            // Don't show alert if it's a 404 (handled by backend if profile doesn't exist yet)
        } finally {
            setLoading(false);
        }
    };

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
            uploadItem(result.assets[0]);
        }
    };

    const uploadItem = async (asset: any) => {
        try {
            setUploading(true);

            const formData = new FormData();
            const filename = asset.uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename || '');
            const extension = match ? match[1] : 'jpg';

            // Determine mime type
            let mimeType = 'image/jpeg';
            if (asset.type === 'video' || asset.mimeType?.startsWith('video')) {
                mimeType = 'video/mp4';
            } else if (asset.mimeType) {
                mimeType = asset.mimeType;
            } else if (match) {
                mimeType = `image/${match[1]}`;
            }

            // @ts-ignore
            formData.append('file', {
                uri: asset.uri,
                name: filename || `upload.${extension}`,
                type: mimeType,
            });

            formData.append('title', 'Portfolio Item');

            const res = await providerAPI.addPortfolioItem(formData);
            if (res.success) {
                Alert.alert('Success', 'Portfolio item added successfully!');
                fetchPortfolio();
            } else {
                Alert.alert('Error', res.message || 'Failed to upload item');
            }
        } catch (error: any) {
            console.error("Upload error details:", error.response?.data || error.message);
            Alert.alert('Error', 'An error occurred during upload. Please ensure your backend is running and the profile is complete.');
        } finally {
            setUploading(false);
        }
    };

    const deleteItem = async (id: string) => {
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
                            console.error("Delete error:", error);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.itemContainer}>
            <Image
                source={{ uri: item.mediaUrl.startsWith('http') ? item.mediaUrl : `https://sillconnect-backend.onrender.com/${item.mediaUrl}` }}
                style={styles.itemImage}
            />
            {item.mediaType === 'VIDEO' && (
                <View style={styles.videoOverlay}>
                    <Ionicons name="play" size={24} color="#fff" />
                </View>
            )}
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteItem(item.id)}
            >
                <Ionicons name="trash-outline" size={16} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <ScreenWrapper bg={"#030712"}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Portfolio</Text>
                <TouchableOpacity onPress={pickMedia} disabled={uploading}>
                    {uploading ? (
                        <ActivityIndicator size="small" color="#3B82F6" />
                    ) : (
                        <View style={styles.addButton}>
                            <Ionicons name="add" size={28} color="#fff" />
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#3B82F6" />
                    </View>
                ) : items.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="images" size={60} color="#374151" />
                        </View>
                        <Text style={styles.emptyTitle}>No Portfolio Items</Text>
                        <Text style={styles.emptySubtitle}>Showcase your best work by adding photos and videos of your services.</Text>
                        <TouchableOpacity style={styles.addFirstBtn} onPress={pickMedia}>
                            <Text style={styles.addBtnText}>Add to Portfolio</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        numColumns={COLUMN_COUNT}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    itemContainer: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#111827',
        marginRight: (width - 40 - (ITEM_SIZE * COLUMN_COUNT)) / (COLUMN_COUNT - 1) || 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    videoOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteBtn: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#111827',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#111827',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    emptySubtitle: {
        color: '#9CA3AF',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    addFirstBtn: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    addBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default Portfolio;
