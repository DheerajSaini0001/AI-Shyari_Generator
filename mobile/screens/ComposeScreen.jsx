import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PenTool, Send, Quote } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../context/ThemeContext';

export default function ComposeScreen() {
    const { isDarkMode } = useTheme();
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    // Status can be simplified to Alert for mobile, or a toast. We'll use Alert for simplicity + Toast if we had one.

    const handleSubmit = async () => {
        if (!text.trim()) {
            Alert.alert("Empty Canvas", "Please write something before submitting.");
            return;
        }

        const token = await SecureStore.getItemAsync('token');
        if (!token) {
            Alert.alert("Login Required", "Please login to share your masterpiece.");
            return;
        }

        setLoading(true);
        Keyboard.dismiss();

        try {
            const response = await fetch(`https://alfaaz-backend.vercel.app/api/community/compose`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ text })
            });

            if (response.ok) {
                setText("");
                Alert.alert("Submitted!", "Your masterpiece has been sent for approval.", [
                    { text: "OK" }
                ]);
            } else {
                Alert.alert("Error", "Failed to submit. Please try again.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className={`flex-1 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
            <StatusBar style={isDarkMode ? "light" : "dark"} translucent={true} backgroundColor="transparent" />
            <LinearGradient
                colors={isDarkMode ? ['#000000', '#050816', '#000000'] : ['#f9fafb', '#f3f4f6', '#f9fafb']}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100, flexGrow: 1 }}>

                        {/* Header */}
                        <View className="items-center mb-10 mt-4">
                            <Text className="text-4xl font-bold tracking-tighter text-transparent" style={{ color: '#fbbf24' }}>
                                Compose
                            </Text>
                            <Text className={`mt-2 text-center ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                                Share your own words with the world
                            </Text>
                        </View>

                        {/* Input Area */}
                        <View className={`p-6 rounded-3xl mb-8 flex-1 border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <View className="flex-row items-center gap-2 mb-4 opacity-70">
                                <PenTool size={16} color={isDarkMode ? "#fbbf24" : "#d97706"} />
                                <Text className={`text-xs uppercase tracking-widest font-bold ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                                    Your Masterpiece
                                </Text>
                            </View>

                            <TextInput
                                value={text}
                                onChangeText={setText}
                                placeholder="Dil ki baat, lafzon ke saath..."
                                placeholderTextColor={isDarkMode ? "#52525b" : "#9ca3af"}
                                multiline
                                textAlignVertical="top"
                                className={`flex-1 font-serif text-xl leading-relaxed p-0 ${isDarkMode ? 'text-amber-50' : 'text-gray-800'}`}
                                style={{ minHeight: 200 }}
                            />

                            <View className="items-end mt-4">
                                <Quote size={24} color={isDarkMode ? "#fbbf24" : "#d97706"} style={{ opacity: 0.3 }} />
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl items-center justify-center flex-row gap-2 mb-6 ${loading ? 'opacity-70' : ''}`}
                            style={{
                                backgroundColor: loading ? '#3f3f46' : '#fbbf24',
                                shadowColor: '#fbbf24',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 6
                            }}
                        >
                            {loading ? (
                                <>
                                    <ActivityIndicator color="white" />
                                    <Text className="text-white font-bold text-lg">Submitting...</Text>
                                </>
                            ) : (
                                <>
                                    <Send color="black" size={20} />
                                    <Text className="text-black font-bold text-lg">Submit for Approval</Text>
                                </>
                            )}
                        </TouchableOpacity>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
