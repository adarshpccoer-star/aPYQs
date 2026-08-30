import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClientProvider } from '@tanstack/react-query';
import './global.css';

import HomeScreen from './src/screens/main/HomeScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import Settings from './src/screens/main/Settings';
import LoginScreen from './src/screens/main/LoginScreen';
import SignupForm from './src/screens/main/SignupForm';

import { AuthDeepLinkListener } from './src/auth/AuthDeepLinkListener';
import { AuthProvider } from './src/auth/AuthProvider';
import { useAuthStore } from './src/store/useAuthStore';
import { AppThemeProvider } from './src/components/ThemeProvider';
import { queryClient } from './src/lib/queryClient';
import BrowseScreen from './src/screens/pyqs/BrowseScreen';
import PracticeScreen from './src/screens/pyqs/PracticeScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isRestoring = useAuthStore(state => state.isRestoring);

  if (isRestoring) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Setting" component={Settings} />
            <Stack.Screen name="Browse" component={BrowseScreen} />
            <Stack.Screen name="Practice" component={PracticeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="signup" component={SignupForm} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <AuthDeepLinkListener />
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </AppThemeProvider>
      </QueryClientProvider>
    </>
  );
}
