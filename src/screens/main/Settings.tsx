// src/screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
// Update this import to include ThemeMode 👇
import { useThemeStore, ThemeMode } from '../../store/useThemeStore';
import { ScreenLayout } from '../../components/ScreenLayout';

export default function SettingsScreen() {
  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const setTheme = useThemeStore(state => state.setTheme);

  return (
    <ScreenLayout title="Settings">
      <View className="flex-1 bg-white dark:bg-slate-900 justify-center items-center p-6">
        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Current Theme: {theme}
        </Text>

        {/* Toggle Button */}
        <Pressable
          onPress={toggleTheme}
          className="bg-indigo-600 dark:bg-indigo-500 px-6 py-3 rounded-lg mb-6 active:opacity-80"
        >
          <Text className="text-white font-semibold">Toggle Theme 🌙</Text>
        </Pressable>

        {/* Specific Mode Selectors */}
        <View className="flex-row gap-3">
          {(['light', 'dark', 'system'] as ThemeMode[]).map(mode => (
            <Pressable
              key={mode}
              onPress={() => setTheme(mode)}
              className={`px-4 py-2 rounded-md border ${
                theme === mode
                  ? 'bg-indigo-100 border-indigo-600 dark:bg-indigo-950 dark:border-indigo-400'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              <Text
                className={`capitalize font-medium ${
                  theme === mode
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {mode}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScreenLayout>
  );
}
