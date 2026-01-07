import React, { useState, useMemo, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Dimensions, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from "react-native";
import { StatusBar } from "expo-status-bar";
// ... (rest of imports)

// ... (inside component)
<SafeAreaView className="flex-1 px-6">
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 w-full"
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View className="w-full bg-white/10 p-6 rounded-3xl border border-white/10" style={{ backdropFilter: 'blur(20px)' }}>
                {/* ... (form content remains same) ... */}
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
</SafeAreaView>
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, withSequence, FadeInUp, FadeOutUp } from "react-native-reanimated";
import { Eye, EyeOff, KeyRound, MailCheck, AlertCircle } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get("window");

const floatingWords = [
    "प्रेम", "हृदय", "भावना", "अनुभूति", "मौन", "शब्द", "कविता", "स्मृति", "आत्मा", "संवेदना",
    "आस", "विश्वास", "स्पर्श", "सौंदर्य", "सपना", "चाहत", "ममता", "आँचल", "धड़कन", "संगीत",
    "निशा", "प्रभात", "चाँद", "तारे", "आकाश", "रात", "सवेरा", "धूप", "छाया", "हवा"
];

const FloatingWord = ({ word }) => {
    // Random initial position
    const initialX = Math.random() * width;
    const initialY = Math.random() * height;

    // Animation definition
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        const duration = 12000 + Math.random() * 10000;
        const delay = Math.random() * 2000;

        opacity.value = withDelay(delay, withRepeat(withSequence(
            withTiming(0.8, { duration: duration / 2 }),
            withTiming(0.2, { duration: duration / 2 })
        ), -1, true));

        translateX.value = withDelay(delay, withRepeat(withTiming((Math.random() - 0.5) * 100, { duration: duration }), -1, true));
        translateY.value = withDelay(delay, withRepeat(withTiming((Math.random() - 0.5) * 100, { duration: duration }), -1, true));
    }, []);

    const style = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
            opacity: opacity.value,
        };
    });

    return (
        <Animated.Text style={[style, {
            position: 'absolute',
            left: initialX,
            top: initialY,
            color: '#fcd34d', // amber-300
            fontSize: 24,
            fontFamily: 'serif',
            textShadowColor: 'rgba(255, 191, 0, 0.5)',
            textShadowRadius: 10
        }]}>
            {word}
        </Animated.Text>
    );
};

const Toast = ({ message, type, visible, onHide }) => {
    if (!visible) return null;

    return (
        <Animated.View
            entering={FadeInUp.springify().damping(15)}
            exiting={FadeOutUp}
            style={{
                position: 'absolute',
                top: 60, // Top of SafeArea
                left: 16,
                right: 16,
                zIndex: 100,
                shadowColor: type === 'error' ? '#ef4444' : '#fbbf24',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.5,
                shadowRadius: 16,
                elevation: 10,
            }}
        >
            <View className={`rounded-2xl overflow-hidden border ${type === 'error' ? 'border-red-500/30' : 'border-amber-400/30'}`}>
                <BlurView intensity={20} tint="dark" className={`flex-row items-center p-4 gap-4 ${type === 'error' ? 'bg-red-950/60' : 'bg-zinc-900/60'}`}>
                    {/* Icon Container */}
                    <View className={`h-12 w-12 rounded-full items-center justify-center ${type === 'error' ? 'bg-red-500/20' : 'bg-amber-400/20'}`}>
                        {type === 'error' ? (
                            <AlertCircle color="#ef4444" size={24} />
                        ) : (
                            <MailCheck color="#fbbf24" size={24} />
                        )}
                    </View>

                    {/* Text Container */}
                    <View className="flex-1">
                        <Text className={`font-bold text-lg mb-0.5 ${type === 'error' ? 'text-red-400' : 'text-amber-400'}`}>
                            {type === 'error' ? 'Action Failed' : 'Code Sent Successfully'}
                        </Text>
                        <Text className="text-zinc-300 text-xs font-medium leading-4">
                            {message}
                        </Text>
                    </View>
                </BlurView>

                {/* Progress Line (Decorative) */}
                <View className={`h-1 w-full ${type === 'error' ? 'bg-red-500/20' : 'bg-amber-400/20'}`}>
                    <View className={`h-full w-2/3 ${type === 'error' ? 'bg-red-500' : 'bg-amber-400'}`} />
                </View>
            </View>
        </Animated.View>
    );
};

export default function SignupScreen() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState(1); // 1: Registration Form, 2: OTP Verification
    const [otp, setOtp] = useState("");
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
    const navigation = useNavigation();

    const visibleWords = useMemo(() => {
        return [...floatingWords].sort(() => 0.5 - Math.random()).slice(0, 12);
    }, []);

    const showToast = (message, type = "success") => {
        setToast({ visible: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async () => {
        Keyboard.dismiss();
        if (!formData.name || !formData.email || !formData.password) {
            setError("All fields are required");
            showToast("All fields are required", "error");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await fetch(`https://alfaaz-backend.vercel.app/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, email: formData.email.toLowerCase().trim() }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Signup failed");

            // Success: Move to Step 2
            setStep(2);
            showToast("A verification code has been sent to your email.", "success");
        } catch (err) {
            setError(err.message);
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        Keyboard.dismiss();
        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit code");
            showToast("Please enter a valid 6-digit code", "error");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await fetch(`https://alfaaz-backend.vercel.app/api/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email.toLowerCase().trim(), otp }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Verification failed");

            showToast("Account verified successfully! Logging you in...", "success");

            // Navigate to Login after short delay or directly login if response returns token
            setTimeout(() => {
                navigation.navigate("Login");
            }, 1000);
        } catch (err) {
            setError(err.message);
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar style="light" translucent={true} backgroundColor="transparent" />
            <LinearGradient
                colors={['#000000', '#050816', '#000000']}
                style={StyleSheet.absoluteFillObject}
            />

            <Toast visible={toast.visible} message={toast.message} type={toast.type} />

            {/* Floating Words */}
            {visibleWords.map((word, i) => (
                <FloatingWord key={i} word={word} />
            ))}

            {/* Overlay */}
            <View className="absolute inset-0 bg-black/60" />

            <SafeAreaView className="flex-1 px-6">
                <KeyboardAvoidingView
                    behavior="padding"
                    className="flex-1 w-full"
                    keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 200 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="w-full bg-white/10 p-6 rounded-3xl border border-white/10" style={{ backdropFilter: 'blur(60px)' }}>
                            <View className="items-center mb-8">
                                <Text className="text-4xl font-bold text-amber-400">
                                    {step === 1 ? "अल्फ़ाज़" : "Validate Email"}
                                </Text>
                                <Text className="text-zinc-400 text-sm italic mt-2">
                                    {step === 1 ? "Start your poetic journey" : `Code sent to ${formData.email}`}
                                </Text>
                            </View>

                            {error ? (
                                <Text className="text-red-400 text-center mb-4 bg-red-500/10 p-2 rounded">{error}</Text>
                            ) : null}

                            {step === 1 ? (
                                <View className="space-y-4 gap-4">
                                    <View>
                                        <Text className="text-zinc-400 text-sm mb-1 ml-1">Name</Text>
                                        <TextInput
                                            placeholder="Your Name"
                                            placeholderTextColor="#71717a"
                                            className={`w-full bg-black/30 text-white p-4 rounded-xl border border-white/10 focus:border-amber-400 ${loading ? 'opacity-50' : ''}`}
                                            value={formData.name}
                                            onChangeText={(text) => handleChange("name", text)}
                                            editable={!loading}
                                        />
                                    </View>

                                    <View>
                                        <Text className="text-zinc-400 text-sm mb-1 ml-1">Email</Text>
                                        <TextInput
                                            placeholder="Email address"
                                            placeholderTextColor="#71717a"
                                            className={`w-full bg-black/30 text-white p-4 rounded-xl border border-white/10 focus:border-amber-400 ${loading ? 'opacity-50' : ''}`}
                                            value={formData.email}
                                            onChangeText={(text) => handleChange("email", text)}
                                            autoCapitalize="none"
                                            editable={!loading}
                                        />
                                    </View>

                                    <View>
                                        <Text className="text-zinc-400 text-sm mb-1 ml-1">Password</Text>
                                        <View className="relative">
                                            <TextInput
                                                placeholder="Create a password"
                                                placeholderTextColor="#71717a"
                                                secureTextEntry={!showPassword}
                                                className={`w-full bg-black/30 text-white p-4 rounded-xl border border-white/10 focus:border-amber-400 pr-12 ${loading ? 'opacity-50' : ''}`}
                                                value={formData.password}
                                                onChangeText={(text) => handleChange("password", text)}
                                                editable={!loading}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-4"
                                            >
                                                {showPassword ? <EyeOff color="#a1a1aa" size={20} /> : <Eye color="#a1a1aa" size={20} />}
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleRegister}
                                        disabled={loading}
                                        className={`w-full py-4 rounded-xl bg-amber-400 items-center justify-center mt-4 shadow-lg shadow-amber-500/30 ${loading ? 'opacity-70' : ''}`}
                                    >
                                        <Text className="text-black font-semibold text-lg">
                                            {loading ? "Sending Code..." : "Sign Up"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View className="space-y-4 gap-4">
                                    <View className="relative">
                                        <TextInput
                                            placeholder="Enter 6-digit Code"
                                            placeholderTextColor="#71717a"
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            className={`w-full bg-black/30 text-white p-4 rounded-xl border border-white/10 focus:border-amber-400 pl-12 ${loading ? 'opacity-50' : ''}`}
                                            value={otp}
                                            onChangeText={setOtp}
                                            editable={!loading}
                                        />
                                        <View className="absolute left-4 top-4">
                                            <KeyRound color="#a1a1aa" size={20} />
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleVerifyOtp}
                                        disabled={loading}
                                        className={`w-full py-4 rounded-xl bg-amber-400 items-center justify-center mt-4 shadow-lg shadow-amber-500/30 ${loading ? 'opacity-70' : ''}`}
                                    >
                                        <Text className="text-black font-semibold text-lg">
                                            {loading ? "Verifying..." : "Verify & Create Account"}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => !loading && setStep(1)} className="items-center mt-4" disabled={loading}>
                                        <Text className={`text-zinc-400 ${loading ? 'opacity-50' : ''}`}>Back to Details</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <View className="mt-6 items-center">
                                <View className="flex-row">
                                    <Text className="text-zinc-500">Already have an account? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate("Login")} disabled={loading}>
                                        <Text className={`text-amber-400 ${loading ? 'opacity-50' : ''}`}>Login</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
