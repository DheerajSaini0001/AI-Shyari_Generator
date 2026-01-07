import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Check, CheckCheck } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function NotificationScreen() {
    const { isDarkMode } = useTheme();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (!token) {
                setLoading(false);
                setRefreshing(false);
                return;
            }

            const response = await fetch(`https://alfaaz-backend.vercel.app/api/notifications`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            await fetch(`https://alfaaz-backend.vercel.app/api/notifications/${id}/read`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            // Optimistic update
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            await fetch(`https://alfaaz-backend.vercel.app/api/notifications/read-all`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            // Optimistic update
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error(error);
        }
    };

    const renderItem = ({ item }) => {
        const isRead = item.isRead;
        const typeColor = item.type === 'success' ? '#4ade80' : item.type === 'error' ? '#f87171' : '#60a5fa';

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => !isRead && markAsRead(item._id)}
                className={`flex-row p-4 mb-3 rounded-2xl border ${!isRead
                        ? (isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white border-blue-200 shadow-sm')
                        : (isDarkMode ? 'bg-transparent border-transparent' : 'bg-transparent border-transparent')
                    }`}
            >
                {/* Indicator Dot */}
                <View className={`w-2 h-2 rounded-full mt-2 mr-4`} style={{ backgroundColor: typeColor }} />

                <View className="flex-1">
                    <Text className={`text-base leading-6 mb-2 ${isDarkMode ? 'text-zinc-200' : 'text-gray-800'} ${!isRead ? 'font-bold' : ''}`}>
                        {item.message}
                    </Text>
                    <Text className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>

                {/* Mark Read Action */}
                {!isRead && (
                    <TouchableOpacity
                        onPress={() => markAsRead(item._id)}
                        className={`w-8 h-8 rounded-full items-center justify-center ml-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}
                    >
                        <Check size={14} color={isDarkMode ? "#a1a1aa" : "#6b7280"} />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View className={`flex-1 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
            <StatusBar style={isDarkMode ? "light" : "dark"} translucent={true} backgroundColor="transparent" />
            <LinearGradient
                colors={isDarkMode ? ['#000000', '#050816', '#000000'] : ['#f9fafb', '#f3f4f6', '#f9fafb']}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
                    <Text className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Notifications
                    </Text>
                    {notifications.some(n => !n.isRead) && (
                        <TouchableOpacity
                            onPress={markAllAsRead}
                            className={`flex-row items-center gap-1 px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}
                        >
                            <CheckCheck size={14} color={isDarkMode ? "#fbbf24" : "#d97706"} />
                            <Text className={`text-xs font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#fbbf24" />
                    </View>
                ) : (
                    <FlatList
                        data={notifications}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbbf24" />
                        }
                        ListEmptyComponent={
                            <View className="items-center justify-center py-20 opacity-50">
                                <Bell size={64} color={isDarkMode ? "#52525b" : "#d1d5db"} />
                                <Text className={`text-lg font-bold mt-6 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>
                                    All Caught Up
                                </Text>
                                <Text className={`text-sm mt-2 ${isDarkMode ? 'text-zinc-600' : 'text-gray-500'}`}>
                                    No new notifications for you.
                                </Text>
                            </View>
                        }
                    />
                )}
            </SafeAreaView>
        </View>
    );
}
