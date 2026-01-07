import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heart, PenTool, Trash2, Copy, LogOut, Sun, Moon, Shield } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../context/ThemeContext';

// Component for a single card (Like or Post)
const ContentCard = ({ item, isLikeTab, onDelete, onCopy, isDarkMode }) => {
    // Determine which date to show
    const dateToShow = item.likedAt || item.createdAt;

    return (
        <View className={`mb-4 rounded-xl overflow-hidden border ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <View className="p-4">
                <View className="flex-row justify-end gap-2 mb-2">
                    <TouchableOpacity
                        onPress={() => onCopy(item.text)}
                        className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 active:bg-amber-500/20' : 'bg-gray-100 active:bg-amber-100'}`}
                    >
                        <Copy size={16} color="#fbbf24" />
                    </TouchableOpacity>
                    {isLikeTab && (
                        <TouchableOpacity
                            onPress={() => onDelete(item._id, item.type)}
                            className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 active:bg-red-500/20' : 'bg-gray-100 active:bg-red-100'}`}
                        >
                            <Trash2 size={16} color="#ef4444" />
                        </TouchableOpacity>
                    )}
                </View>

                <Text className={`font-serif text-lg leading-7 mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {item.text}
                </Text>

                <View className={`pt-3 border-t flex-row justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <Text className="text-zinc-500 text-xs">
                        {dateToShow ? new Date(dateToShow).toLocaleDateString() : ''}
                    </Text>
                    {isLikeTab ? (
                        <Heart size={14} color="#ef4444" fill="#ef4444" />
                    ) : (
                        <View className="flex-row items-center gap-1">
                            <Heart size={14} color="#ef4444" />
                            <Text className="text-zinc-400 text-xs">{item.likes?.length || 0} Likes</Text>
                        </View>
                    )}
                </View>

                {/* Tag for Community vs Saved */}
                {isLikeTab && item.type === 'community' && (
                    <View className="absolute top-4 left-4 bg-blue-500/20 px-2 py-1 rounded">
                        <Text className="text-blue-400 text-[10px] font-bold uppercase">Community</Text>
                    </View>
                )}
                {isLikeTab && item.type === 'saved' && (
                    <View className="absolute top-4 left-4 bg-amber-500/20 px-2 py-1 rounded">
                        <Text className="text-amber-400 text-[10px] font-bold uppercase">Saved</Text>
                    </View>
                )}

            </View>
        </View>
    );
};

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { isDarkMode, toggleTheme } = useTheme();

    const [user, setUser] = useState(null);
    const [likes, setLikes] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("likes"); // 'likes' or 'posts'
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const storedUser = await SecureStore.getItemAsync('user');

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            if (!token) return;

            // 1. Fetch Saved Shayaris (Personal Collection)
            const savedRes = await fetch(`https://alfaaz-backend.vercel.app/api/shayari/liked`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            let savedData = [];
            if (savedRes.ok) {
                savedData = await savedRes.json();
                savedData = savedData.map(item => ({ ...item, type: 'saved' }));
            }

            // 2. Fetch Liked Feed Posts (Community)
            // Note: We need to use the endpoint we just added to backend: /api/community/liked-by-user
            // If backend deployment isn't instant or local, this might fail if running against live backend that doesn't have the new route yet.
            // Assuming local dev or quick deploy. If live backend is Vercel, I can't update it from here really.
            // Oh, I am editing local files but user is pointing to `https://alfaaz-backend.vercel.app`.
            // WAIT. The backend URL is Vercel. I cannot update the Vercel backend code!
            // I updated the local `server/routes` files but the app is pointing to the remote URL.

            // CRITICAL REALIZATION: I CANNOT UPDATE THE BACKEND LOGIC IF IT IS HOSTED REMOTELY.
            // The user's app points to `https://alfaaz-backend.vercel.app`.
            // Unless the user deploys the changes I made to local server files to Vercel, my logic for `liked-by-user` will 404.

            // I should revert to a client-side solution if possible, OR ask user to deploy.
            // But I am an AI, I should try to solve it.
            // Can I fetch ALL feed posts and filter?
            // GET /api/community/feed?type=alfaaz AND ?type=composed.
            // This is heavy but might work for small datasets.

            let communityData = [];
            try {
                // Trying to fetch feed to filter manually since I can't deploy backend changes
                // Fetch both types
                const [res1, res2] = await Promise.all([
                    fetch(`https://alfaaz-backend.vercel.app/api/community/feed?type=alfaaz`),
                    fetch(`https://alfaaz-backend.vercel.app/api/community/feed?type=composed`)
                ]);

                let feed1 = [];
                let feed2 = [];
                if (res1.ok) feed1 = await res1.json();
                if (res2.ok) feed2 = await res2.json();

                const allFeed = [...feed1, ...feed2];
                const userId = JSON.parse(storedUser)?._id || JSON.parse(storedUser)?.id;

                if (userId) {
                    communityData = allFeed.filter(post => post.likes && post.likes.includes(userId));
                    communityData = communityData.map(item => ({ ...item, type: 'community' }));
                }

            } catch (feedErr) {
                console.log("Error filtering feed likes:", feedErr);
            }

            // Combine and Sort
            // Sort by createdAt / likedAt descending
            const combinedLikes = [...savedData, ...communityData].sort((a, b) => {
                const dateA = new Date(a.likedAt || a.createdAt);
                const dateB = new Date(b.likedAt || b.createdAt);
                return dateB - dateA;
            });

            setLikes(combinedLikes);


            // Fetch My Posts
            const postsRes = await fetch(`https://alfaaz-backend.vercel.app/api/community/my-posts`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (postsRes.ok) {
                const data = await postsRes.json();
                setMyPosts(data);
            }

        } catch (error) {
            console.error("Error loading profile data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadData();
    }, []);

    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
        // Toast logic could go here
    };

    const deleteLike = async (id, type) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (!token) return;

            let url = '';
            let method = '';

            if (type === 'saved') {
                url = `https://alfaaz-backend.vercel.app/api/shayari/like/${id}`;
                method = 'DELETE';
            } else if (type === 'community') {
                url = `https://alfaaz-backend.vercel.app/api/community/like/${id}`;
                method = 'POST'; // "Like" acts as toggle
            } else {
                // Fallback for old data or unclear type
                url = `https://alfaaz-backend.vercel.app/api/shayari/like/${id}`;
                method = 'DELETE';
            }

            const response = await fetch(url, {
                method: method,
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                // If we unliked a community post, we might get back the new likes array.
                // If we deleted a saved post, we get a success message.
                // In either case, we should remove it from the local list.
                setLikes(prev => prev.filter(item => item._id !== id));
            }
        } catch (error) {
            console.error("Error deleting like:", error);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        await SecureStore.deleteItemAsync('token');
                        await SecureStore.deleteItemAsync('user');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                }
            ]
        );
    };

    return (
        <View className={`flex-1 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
            <StatusBar style={isDarkMode ? "light" : "dark"} translucent={true} backgroundColor="transparent" />
            <LinearGradient
                colors={isDarkMode ? ['#000000', '#050816', '#000000'] : ['#f9fafb', '#f3f4f6', '#f9fafb']}
                style={StyleSheet.absoluteFillObject}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 100, paddingHorizontal: 20 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbbf24" />}
            >
                {/* Top Action Bar */}
                <View className="flex-row justify-end gap-3 mb-4">
                    {user?.isAdmin && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('AdminDashboard')}
                            className={`w-10 h-10 items-center justify-center rounded-full border ${isDarkMode ? 'bg-amber-500/10 active:bg-amber-500/20 border-amber-500/20' : 'bg-amber-50 active:bg-amber-100 border-amber-100'}`}
                            style={{ borderRadius: 20 }}
                        >
                            <Shield size={20} color="#fbbf24" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={toggleTheme}
                        className={`w-10 h-10 items-center justify-center rounded-full border ${isDarkMode ? 'bg-white/10 active:bg-white/20 border-white/5' : 'bg-white active:bg-gray-100 border-gray-200'}`}
                        style={{ borderRadius: 20 }}
                    >
                        {isDarkMode ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} color="#fbbf24" />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleLogout}
                        className={`w-10 h-10 items-center justify-center rounded-full border ${isDarkMode ? 'bg-red-500/10 active:bg-red-500/20 border-red-500/20' : 'bg-red-50 active:bg-red-100 border-red-100'}`}
                        style={{ borderRadius: 20 }}
                    >
                        <LogOut size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>

                {/* Header */}
                <View className="items-center mb-8">
                    <View className={`mb-4 items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-white border border-gray-100'}`} style={{ width: 120, height: 120, borderRadius: 60 }}>
                        <LinearGradient
                            colors={['#fbbf24', '#d97706', '#b45309']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="w-28 h-28 rounded-full items-center justify-center border-4 border-white/20"
                            style={{ borderRadius: 100 }}
                        >
                            <Text className="text-5xl font-bold text-white shadow-sm" style={{ textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }}>
                                {user?.name?.charAt(0) || "U"}
                            </Text>
                        </LinearGradient>
                    </View>
                    <Text className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name || "Your Profile"}</Text>
                    <Text className="text-zinc-400">Your personal collection of gems</Text>
                </View>

                {/* Stats */}
                <View className="flex-row gap-4 mb-8">
                    <TouchableOpacity
                        onPress={() => setActiveTab('likes')}
                        className={`flex-1 p-4 rounded-2xl border ${isDarkMode ? (activeTab === 'likes' ? 'bg-white/10 border-amber-500/50' : 'bg-white/5 border-white/5') : (activeTab === 'likes' ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200')}`}
                    >
                        <Text className="text-2xl font-bold text-amber-400 text-center mb-1">{likes.length}</Text>
                        <Text className={`text-xs font-bold text-center uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Liked</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('posts')}
                        className={`flex-1 p-4 rounded-2xl border ${isDarkMode ? (activeTab === 'posts' ? 'bg-white/10 border-blue-500/50' : 'bg-white/5 border-white/5') : (activeTab === 'posts' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200')}`}
                    >
                        <Text className="text-2xl font-bold text-blue-400 text-center mb-1">{myPosts.length}</Text>
                        <Text className={`text-xs font-bold text-center uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Shared</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View className={`flex-row mb-6 border-b pb-2 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('likes')}
                        className="flex-1 flex-row justify-center items-center gap-2 pb-2"
                    >
                        <Heart size={20} color={activeTab === 'likes' ? '#fbbf24' : '#71717a'} fill={activeTab === 'likes' ? '#fbbf24' : 'transparent'} />
                        <Text className={`font-bold ${activeTab === 'likes' ? 'text-amber-400' : 'text-zinc-500'}`}>Liked</Text>
                        {activeTab === 'likes' && <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('posts')}
                        className="flex-1 flex-row justify-center items-center gap-2 pb-2"
                    >
                        <PenTool size={20} color={activeTab === 'posts' ? '#60a5fa' : '#71717a'} />
                        <Text className={`font-bold ${activeTab === 'posts' ? 'text-blue-400' : 'text-zinc-500'}`}>Shared</Text>
                        {activeTab === 'posts' && <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
                    </TouchableOpacity>
                </View>

                {/* Content List */}
                {loading ? (
                    <Text className="text-zinc-500 text-center mt-10">Loading...</Text>
                ) : (
                    <View>
                        {activeTab === 'likes' ? (
                            likes.length === 0 ? (
                                <View className={`items-center py-10 border border-dashed rounded-2xl ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-300 bg-gray-50'}`}>
                                    <Heart size={40} color="#52525b" />
                                    <Text className="text-zinc-400 mt-4">No liked shayaris yet.</Text>
                                    <Text className="text-zinc-600 text-xs mt-1">Go explore some magic!</Text>
                                </View>
                            ) : (
                                likes.map((item, index) => (
                                    <ContentCard
                                        key={item._id || index}
                                        item={item}
                                        isLikeTab={true}
                                        onDelete={deleteLike}
                                        onCopy={copyToClipboard}
                                        isDarkMode={isDarkMode}
                                    />
                                ))
                            )
                        ) : (
                            myPosts.length === 0 ? (
                                <View className={`items-center py-10 border border-dashed rounded-2xl ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-300 bg-gray-50'}`}>
                                    <PenTool size={40} color="#52525b" />
                                    <Text className="text-zinc-400 mt-4">No posts yet.</Text>
                                    <Text className="text-zinc-600 text-xs mt-1">Share your first masterpiece!</Text>
                                </View>
                            ) : (
                                myPosts.map((item, index) => (
                                    <ContentCard
                                        key={item._id || index}
                                        item={item}
                                        isLikeTab={false}
                                        onCopy={copyToClipboard}
                                        isDarkMode={isDarkMode}
                                    />
                                ))
                            )
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
