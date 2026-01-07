import "./global.css";
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

LogBox.ignoreLogs([
    '[Reanimated] Reading from `value` during component render',
    '[Reanimated] Writing to `value` during component render',
    '[Reanimated] Reading from `value` during component render. Please ensure that you don\'t access the `value` property nor use `get` method of a shared value while React is rendering a component.',
    'SafeAreaView has been deprecated'
]);

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainTabs from './navigation/MainTabs';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import { ThemeProvider } from './context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
    const [isReady, setIsReady] = useState(false);
    const [initialRoute, setInitialRoute] = useState("Login");

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                if (token) {
                    setInitialRoute("Main");
                }
            } catch (error) {
                console.error("Error checking login status:", error);
            } finally {
                setIsReady(true);
            }
        };

        checkLoginStatus();
    }, []);

    if (!isReady) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#fbbf24" />
            </View>
        );
    }

    return (
        <ThemeProvider>
            <SafeAreaProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                        <Stack.Screen name="Main" component={MainTabs} />
                        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}
