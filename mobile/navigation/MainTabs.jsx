import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, Sparkles, PenTool, Bell, User } from 'lucide-react-native';

import FeedScreen from '../screens/FeedScreen';
import AIScreen from '../screens/AIScreen';
import ComposeScreen from '../screens/ComposeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#000000',
                    borderTopWidth: 0,
                    height: Platform.OS === 'ios' ? 85 : 60,
                    paddingTop: 10,
                },
                tabBarBackground: () => (
                    Platform.OS === 'ios' && (
                        <BlurView
                            tint="dark"
                            intensity={80}
                            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        />
                    )
                ),
                tabBarActiveTintColor: '#fbbf24', // amber-400
                tabBarInactiveTintColor: '#71717a', // zinc-500
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={FeedScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="AI"
                component={AIScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Compose"
                component={ComposeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View className="bg-amber-400 h-12 w-12 rounded-full items-center justify-center -mt-4 shadow-lg shadow-amber-500/30">
                            <PenTool color="#000" size={24} />
                        </View>
                    ),
                    tabBarLabel: () => null,
                }}
            />
            <Tab.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
}
