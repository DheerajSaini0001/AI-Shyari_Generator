import React, { useState, useEffect, useCallback, useRef } from "react";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Share, StyleSheet, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles, PenTool, Heart, Copy, Share2, Clock, Sun, Moon } from "lucide-react-native";
import * as ExpoClipboard from 'expo-clipboard';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from "../context/ThemeContext";

export default function FeedScreen() {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigation = useNavigation();
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState("composed"); // 'alfaaz' or 'composed'
    const [currentUser, setCurrentUser] = useState(null);
    const flatListRef = useRef(null);

    // Manual Scroll to Top Implementation to avoid Context Errors
    useEffect(() => {
        const unsubscribe = navigation.getParent()?.addListener('tabPress', (e) => {
            // If the user taps the active tab, scroll to top
            if (navigation.isFocused()) {
                e.preventDefault(); // Optional: prevent default if you want to override completely, but usually better to let nav handle focus
                flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            }
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        loadUser();
        fetchFeed();
    }, [activeTab]);

    const loadUser = async () => {
        try {
            const userStr = await SecureStore.getItemAsync('user');
            if (userStr) {
                setCurrentUser(JSON.parse(userStr));
            }
        } catch (error) {
            console.log("Error loading user:", error);
        }
    };

    const fetchFeed = async () => {
        // Don't set loading true if refreshing
        if (!refreshing) setLoading(true);
        try {
            const response = await fetch(`https://alfaaz-backend.vercel.app/api/community/feed?type=${activeTab}`);
            if (response.ok) {
                const data = await response.json();
                setFeed(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchFeed();
    }, [activeTab]);

    const handleLike = async (id) => {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
            Alert.alert("Login Required", "Please login to like posts!");
            return;
        }

        // Optimistic update (optional, but good for UX)
        // For now, we'll wait for server response to be safe

        try {
            const response = await fetch(`https://alfaaz-backend.vercel.app/api/community/like/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedLikes = await response.json();
                setFeed(prevFeed => prevFeed.map(item =>
                    item._id === id ? { ...item, likes: updatedLikes } : item
                ));
            } else {
                console.log("Failed to like");
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const copyToClipboard = async (text) => {
        await ExpoClipboard.setStringAsync(text);
        // alert("Copied to clipboard!");
    };

    const handleShare = async (text) => {
        try {
            await Share.share({
                message: text + '\n\n- Shared via Alfaaz',
            });
        } catch (error) {
            console.log(error);
        }
    };

    const renderItem = ({ item, index }) => {
        // Check if liked by current user. 
        // Note: item.likes is array of user IDs. currentUser._id is the logged in user's ID.
        // We need to handle case where currentUser might be null.
        const isLiked = currentUser && item.likes && item.likes.includes(currentUser.id || currentUser._id);

        return (
            <Animated.View
                entering={FadeInDown.springify().damping(12)}
                className={`mb-6 p-6 rounded-2xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}
            >
                <View className="flex-row items-center gap-3 mb-4">
                    <View className={`w-10 h-10 rounded-full items-center justify-center border ${isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-gray-100 border-gray-300"}`}>
                        <Text className={`font-bold ${isDarkMode ? "text-zinc-400" : "text-gray-600"}`}>
                            {item.authorName?.charAt(0)}
                        </Text>
                    </View>
                    <View>
                        <Text className={`font-bold ${isDarkMode ? "text-zinc-200" : "text-gray-800"}`}>
                            {item.authorName}
                        </Text>
                        <View className="flex-row items-center gap-1">
                            <Clock color={isDarkMode ? "#71717a" : "#9ca3af"} size={12} />
                            <Text className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-gray-500"}`}>
                                {new Date(item.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className={`pl-4 border-l-2 mb-4 ${isDarkMode ? "border-amber-500/20" : "border-amber-500/50"}`}>
                    <Text className={`text-xl font-serif leading-relaxed ${isDarkMode ? "text-amber-100/90" : "text-gray-800"}`}>
                        {item.text}
                    </Text>
                </View>

                <View className={`flex-row justify-between pt-4 border-t ${isDarkMode ? "border-white/5" : "border-gray-100"}`}>
                    <TouchableOpacity
                        onPress={() => handleLike(item._id)}
                        className={`flex-row items-center gap-2 px-3 py-1.5 rounded-full transition-all ${isLiked ? (isDarkMode ? "bg-red-500/10" : "bg-red-50") : ""}`}
                    >
                        <Heart size={16} color={isLiked ? "#ef4444" : "#71717a"} fill={isLiked ? "#ef4444" : "transparent"} />
                        <Text className={`${isLiked ? "text-red-500 font-medium" : "text-zinc-500"} text-sm`}>{item.likes?.length || 0}</Text>
                    </TouchableOpacity>

                    <View className="flex-row gap-4">
                        <TouchableOpacity onPress={() => copyToClipboard(item.text)}>
                            <Copy size={16} color="#71717a" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleShare(item.text)}>
                            <Share2 size={16} color="#71717a" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    };

    return (
        <View className={`flex-1 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
            <LinearGradient
                colors={isDarkMode ? ['#000000', '#050816', '#000000'] : ['#f9fafb', '#f3f4f6', '#f9fafb']}
                style={StyleSheet.absoluteFillObject}
            />
            <SafeAreaView className="flex-1">
                {/* Header with Toggle */}
                <View className="flex-row justify-between items-start px-6 mb-6 pt-4">
                    <View className="items-start">
                        <Text className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Community <Text className="text-amber-400">Feed</Text>
                        </Text>
                        <Text className="text-zinc-400 text-sm mt-1">Discover gems from other poets.</Text>
                    </View>
                    <TouchableOpacity
                        onPress={toggleTheme}
                        className={`p-2.5 rounded-full border ${isDarkMode ? 'bg-white/10 active:bg-white/20 border-white/5' : 'bg-white active:bg-gray-100 border-gray-200'}`}
                    >
                        {isDarkMode ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} color="#fbbf24" />}
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View className={`flex-row justify-center gap-8 mb-6 border-b pb-2 mx-4 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <TouchableOpacity
                        onPress={() => setActiveTab("alfaaz")}
                        className={`flex-row items-center gap-2 pb-2 border-b-2 ${activeTab === "alfaaz" ? "border-amber-400" : "border-transparent"}`}
                    >
                        <Sparkles size={20} color={activeTab === "alfaaz" ? "#fbbf24" : "#71717a"} />
                        <Text className={`text-lg font-bold ${activeTab === "alfaaz" ? "text-amber-400" : "text-zinc-500"}`}>
                            Alfaaz Feed
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveTab("composed")}
                        className={`flex-row items-center gap-2 pb-2 border-b-2 ${activeTab === "composed" ? "border-blue-500" : "border-transparent"}`}
                    >
                        <PenTool size={20} color={activeTab === "composed" ? "#3b82f6" : "#71717a"} />
                        <Text className={`text-lg font-bold ${activeTab === "composed" ? "text-blue-500" : "text-zinc-500"}`}>
                            Composed Feed
                        </Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#fbbf24" />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={feed}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
                        initialNumToRender={5}
                        windowSize={3}
                        maxToRenderPerBatch={5}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbbf24" />
                        }
                        ListEmptyComponent={
                            <Text className="text-zinc-500 text-center mt-10">No shayaris yet. Be the first to compose one!</Text>
                        }
                    />
                )}
            </SafeAreaView>
        </View>
    );
}
