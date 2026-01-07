import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from 'nativewind';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        loadTheme();
    }, []);

    // Sync nativewind with our state
    useEffect(() => {
        setColorScheme(isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const loadTheme = async () => {
        try {
            if (Platform.OS === 'web') return; // SecureStore not supported on web
            const savedTheme = await SecureStore.getItemAsync('theme');
            if (savedTheme !== null) {
                setIsDarkMode(savedTheme === 'dark');
            }
        } catch (error) {
            console.log('Error loading theme:', error);
        }
    };

    const toggleTheme = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        try {
            if (Platform.OS !== 'web') {
                await SecureStore.setItemAsync('theme', newMode ? 'dark' : 'light');
            }
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
