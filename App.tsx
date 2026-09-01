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
import EditProfile from './src/screens/main/EditForm';

import { AuthDeepLinkListener } from './src/auth/AuthDeepLinkListener';
import { AuthProvider } from './src/auth/AuthProvider';

import { useAuthStore, User } from './src/store/useAuthStore';

import { AppThemeProvider } from './src/components/ThemeProvider';
import { queryClient } from './src/lib/queryClient';

import BrowseScreen from './src/screens/pyqs/BrowseScreen';
import PracticeScreen from './src/screens/pyqs/PracticeScreen';

const Stack = createNativeStackNavigator();

export const isProfileComplete = (user: User | null) => {
  if (!user) return false;

  return (
    !!user.branchCode &&
    !!user.branchName &&
    user.yearOfGate !== null &&
    user.yearOfGate !== undefined
  );
};

function AppNavigator() {
  const user = useAuthStore(state => state.user);
  const isRestoring = useAuthStore(state => state.isRestoring);

  if (isRestoring) {
    return null;
  }

  const profileComplete = isProfileComplete(user);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : !profileComplete ? (
        <Stack.Screen name="SignupForm" component={SignupForm} />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />

          <Stack.Screen name="Profile" component={ProfileScreen} />

          <Stack.Screen name="EditProfile" component={EditProfile} />

          <Stack.Screen name="Setting" component={Settings} />

          <Stack.Screen name="Browse" component={BrowseScreen} />

          <Stack.Screen name="Practice" component={PracticeScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <AuthDeepLinkListener />
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
