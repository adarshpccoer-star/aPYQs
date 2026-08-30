// src/components/AppThemeProvider.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useThemeStore } from '../store/useThemeStore';

export const AppThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setColorScheme } = useColorScheme();
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    // Synchronize NativeWind internal color scheme
    setColorScheme(theme === 'dark' ? 'dark' : 'light');
  }, [theme, setColorScheme]);

  return (
    <View className={theme === 'dark' ? 'dark flex-1' : 'flex-1'}>
      {children}
    </View>
  );
};
