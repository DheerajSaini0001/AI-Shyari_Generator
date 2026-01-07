import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, X, Shield, ChevronLeft } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function AdminDashboardScreen() {
    const { isDarkMode } = useTheme();
    const navigation = useNavigation();
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchPending();
        }, [])
    );

    const fetchPending = async () => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('token');
            const response = await fetch(`https://alfaaz-backend.vercel.app/api/community/pending`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setPending(data);
            } else {
                // If 403, might not be admin
                if (response.status === 403) {
                    Alert.alert("Access Denied", "You do not have admin privileges.");
                    navigation.goBack();
                }
            }
        } catch (error) {
            console.error("Error fetching pending shayaris:", error);
            Alert.alert("Error", "Failed to fetch pending requests.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const response = await fetch(`https://alfaaz-backend.vercel.app/api/community/${action}/${id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                setPending(prev => prev.filter(item => item._id !== id));
                // Optional success toast
            } else {
                Alert.alert("Error", `Failed to ${action} shayari.`);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Network error occurred.");
        }
    };

    const renderItem = ({ item }) => (
        <View className={`mb-4 p-5 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <View className="flex-row justify-between items-start mb-3">
                <View>
                    <View className="flex-row items-center gap-2 mb-1">
                        <View className="bg-amber-500/10 px-2 py-0.5 rounded">
                            <Text className="text-amber-500 text-[10px] font-bold uppercase tracking-wider">Pending</Text>
                        </View>
                    </View>
                    <Text className={`text-sm font-bold ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                        from {item.authorName}
                    </Text>
                </View>
            </View>

            <Text className={`text-lg font-serif mb-6 leading-relaxed ${isDarkMode ? 'text-amber-50' : 'text-gray-800'}`}>
                {item.text}
            </Text>

            <View className="flex-row gap-3 border-t pt-4 border-dashed" style={{ borderColor: isDarkMode ? '#FFFFFF20' : '#E5E7EB' }}>
                <TouchableOpacity
                    onPress={() => handleAction(item._id, "approve")}
                    className="flex-1 bg-green-500/10 py-3 rounded-xl border border-green-500/20 flex-row items-center justify-center gap-2 active:bg-green-500/20"
                >
                    <Check size={18} color="#4ade80" />
                    <Text className="text-green-500 font-bold">Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleAction(item._id, "reject")}
                    className="flex-1 bg-red-500/10 py-3 rounded-xl border border-red-500/20 flex-row items-center justify-center gap-2 active:bg-red-500/20"
                >
                    <X size={18} color="#f87171" />
                    <Text className="text-red-400 font-bold">Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className={`flex-1 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
            <StatusBar style={isDarkMode ? "light" : "dark"} translucent={true} backgroundColor="transparent" />
            <LinearGradient
                colors={isDarkMode ? ['#000000', '#050816', '#000000'] : ['#f9fafb', '#f3f4f6', '#f9fafb']}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-4 mb-2">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-white border border-gray-200'}`}
                    >
                        <ChevronLeft size={24} color={isDarkMode ? "white" : "black"} />
                    </TouchableOpacity>
                    <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Admin Dashboard
                    </Text>
                    <View className="w-10" />
                </View>

                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#fbbf24" />
                    </View>
                ) : (
                    <FlatList
                        data={pending}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={{ padding: 16 }}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-20 opacity-50">
                                <Shield size={64} color={isDarkMode ? "#52525b" : "#d1d5db"} />
                                <Text className={`text-lg font-bold mt-4 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>
                                    All Caught Up!
                                </Text>
                                <Text className={`text-sm ${isDarkMode ? 'text-zinc-600' : 'text-gray-500'}`}>
                                    No pending submissions.
                                </Text>
                            </View>
                        }
                    />
                )}
            </SafeAreaView>
        </View>
    );
}
