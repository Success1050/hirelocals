import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    TextInput,
    Modal,
    FlatList,
    Image,
    RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import { providerAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';

const Services = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [services, setServices] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Service Images State
    const [serviceImages, setServiceImages] = useState<any[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async (isRefresh = false) => {
        try {
            if (!isRefresh) setLoading(true);
            else setRefreshing(true);

            // Fetch services
            try {
                const servicesRes = await providerAPI.getServices();
                if (servicesRes.success) {
                    setServices(servicesRes.services);
                }
            } catch (error) {
                console.error("Fetch services error:", error);
            }

            // Fetch categories
            try {
                const categoriesRes = await providerAPI.getCategories();
                if (categoriesRes.success) {
                    setCategories(categoriesRes.categories);
                }
            } catch (error) {
                console.error("Fetch categories error:", error);
            }
        } catch (error) {
            console.error("Fetch data error:", error);
        } finally {
            if (!isRefresh) setLoading(false);
            else setRefreshing(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        fetchInitialData(true);
    }, []);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategoryId('');
        setPrice('');
        setDuration('');
        setEditingService(null);
        setServiceImages([]);
    };

    const handleEdit = (service: any) => {
        setEditingService(service);
        setTitle(service.title);
        setDescription(service.description);
        setCategoryId(service.categoryId || '');
        setPrice(service.price.toString());
        setDuration(service.duration?.toString() || '');
        setModalVisible(true);
        fetchServiceImages(service.id);
    };

    const fetchServiceImages = async (serviceId: string) => {
        try {
            setLoadingImages(true);
            const res = await providerAPI.getServiceImages(serviceId);
            if (res.success) {
                setServiceImages(res.images);
            }
        } catch (error) {
            console.error("Fetch images error:", error);
        } finally {
            setLoadingImages(false);
        }
    };

    const handleSubmit = async () => {
        if (!title || !price || !categoryId) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        try {
            const data = {
                title,
                description,
                categoryId,
                price,
                duration,
            };

            let res;
            if (editingService) {
                res = await providerAPI.updateService(editingService.id, data);
            } else {
                res = await providerAPI.createService(data);
            }

            if (res.success) {
                Alert.alert("Success", editingService ? "Service updated" : "Service created");
                setModalVisible(false);
                resetForm();
                fetchInitialData();
            }
        } catch (error) {
            console.error("Submit error:", error);
            Alert.alert("Error", "Failed to save service");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this service?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res = await providerAPI.deleteService(id);
                            if (res.success) {
                                fetchInitialData();
                            }
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete service");
                        }
                    }
                }
            ]
        );
    };

    const pickServiceImage = async () => {
        if (!editingService) {
            Alert.alert("Notice", "Please save the service first before adding images.");
            return;
        }

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need access to your gallery.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            uploadServiceImages(result.assets);
        }
    };

    const uploadServiceImages = async (assets: any[]) => {
        try {
            setLoadingImages(true);
            const formData = new FormData();

            assets.forEach((asset, index) => {
                const filename = asset.uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const extension = match ? match[1] : 'jpg';
                const type = match ? `image/${match[1]}` : `image`;

                // @ts-ignore
                formData.append('files', {
                    uri: asset.uri,
                    name: filename || `image_${index}.${extension}`,
                    type,
                });
            });

            const res = await providerAPI.addServiceImages(editingService.id, formData);
            if (res.success) {
                fetchServiceImages(editingService.id);
            }
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", "Failed to upload images");
        } finally {
            setLoadingImages(false);
        }
    };

    const deleteImage = async (imageId: string) => {
        try {
            const res = await providerAPI.deleteServiceImage(editingService.id, imageId);
            if (res.success) {
                fetchServiceImages(editingService.id);
            }
        } catch (error) {
            console.error("Delete image error:", error);
        }
    };

    return (
        <ScreenWrapper bg={"#030712"}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Services</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        resetForm();
                        setModalVisible(true);
                    }}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : services.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="briefcase-outline" size={80} color="#1F2937" />
                    <Text style={styles.emptyTitle}>No Services Yet</Text>
                    <Text style={styles.emptyText}>Start by adding a service you offer to clients.</Text>
                    <TouchableOpacity
                        style={styles.createBtn}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.createBtnText}>Add First Service</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                    }
                >
                    {services.map((service) => (
                        <View key={service.id} style={styles.serviceCard}>
                            <View style={styles.serviceInfo}>
                                <Text style={styles.serviceTitle}>{service.title}</Text>
                                <Text style={styles.serviceCategory}>
                                    {service.category?.name || 'Uncategorized'}
                                </Text>
                                <Text style={styles.servicePrice}>₦{service.price}</Text>
                                {service.duration && (
                                    <Text style={styles.serviceDuration}>{service.duration} mins</Text>
                                )}
                            </View>
                            <View style={styles.serviceActions}>
                                <TouchableOpacity onPress={() => handleEdit(service)} style={styles.actionBtn}>
                                    <Ionicons name="create-outline" size={22} color="#3B82F6" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(service.id)} style={styles.actionBtn}>
                                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    <View style={{ height: 80 }} />
                </ScrollView>
            )}

            {/* Create/Edit Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingService ? 'Edit Service' : 'Add New Service'}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form}>
                            <Text style={styles.label}>Service Title *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Household Cleaning"
                                placeholderTextColor="#6B7280"
                                value={title}
                                onChangeText={setTitle}
                            />

                            <Text style={styles.label}>Category *</Text>
                            <View style={styles.pickerContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {categories.map(cat => (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={[
                                                styles.catChip,
                                                categoryId === cat.id && styles.catChipSelected
                                            ]}
                                            onPress={() => setCategoryId(cat.id)}
                                        >
                                            <Text style={[
                                                styles.catChipText,
                                                categoryId === cat.id && styles.catChipTextSelected
                                            ]}>
                                                {cat.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Describe what you offer..."
                                placeholderTextColor="#6B7280"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                            />

                            <View style={styles.row}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <Text style={styles.label}>Price (₦) *</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="5000"
                                        placeholderTextColor="#6B7280"
                                        value={price}
                                        onChangeText={setPrice}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Duration (Mins)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="60"
                                        placeholderTextColor="#6B7280"
                                        value={duration}
                                        onChangeText={setDuration}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            {editingService && (
                                <View style={styles.imagesSection}>
                                    <View style={styles.imagesHeader}>
                                        <Text style={styles.label}>Service Images</Text>
                                        <TouchableOpacity onPress={pickServiceImage}>
                                            <Text style={styles.uploadText}>+ Add Media</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {loadingImages ? (
                                        <ActivityIndicator size="small" color="#3B82F6" />
                                    ) : (
                                        <FlatList
                                            data={serviceImages}
                                            horizontal
                                            keyExtractor={item => item.id}
                                            renderItem={({ item }) => (
                                                <View style={styles.imageWrapper}>
                                                    <Image
                                                        source={{ uri: item.mediaUrl.startsWith('http') ? item.mediaUrl : `https://sillconnect-backend.onrender.com/${item.mediaUrl}` }}
                                                        style={styles.previewImage}
                                                    />
                                                    <TouchableOpacity
                                                        style={styles.imageDeleteBtn}
                                                        onPress={() => deleteImage(item.id)}
                                                    >
                                                        <Ionicons name="close-circle" size={20} color="#EF4444" />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                            contentContainerStyle={{ gap: 10 }}
                                        />
                                    )}
                                </View>
                            )}

                            <TouchableOpacity
                                style={[styles.submitBtn, submitting && styles.disabledBtn]}
                                onPress={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitBtnText}>
                                        {editingService ? 'Update Service' : 'Create Service'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <View style={{ height: 40 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
        gap: 15,
    },
    serviceCard: {
        backgroundColor: '#111827',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    serviceInfo: {
        flex: 1,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    serviceCategory: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    servicePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FBBF24',
    },
    serviceDuration: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    serviceActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1F2937',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#030712',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '90%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    form: {
        flex: 1,
    },
    label: {
        color: '#9CA3AF',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#111827',
        borderWidth: 1,
        borderColor: '#1F2937',
        borderRadius: 12,
        padding: 14,
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    pickerContainer: {
        marginBottom: 20,
    },
    catChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#1F2937',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#374151',
    },
    catChipSelected: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3B82F6',
    },
    catChipText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    catChipTextSelected: {
        color: '#3B82F6',
        fontWeight: '600',
    },
    imagesSection: {
        marginBottom: 24,
    },
    imagesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    uploadText: {
        color: '#3B82F6',
        fontWeight: '600',
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 10,
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#1F2937',
    },
    imageDeleteBtn: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#111827',
        borderRadius: 10,
    },
    submitBtn: {
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    submitBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    disabledBtn: {
        opacity: 0.7,
    }
});

export default Services;
