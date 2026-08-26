import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import './global.css';
// /home/adarsh/Desktop/aPYQs/App.tsx
import HomeScreen from './src/screens/main/HomeScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import Settings from './src/screens/main/Settings';
import LoginScreen from './src/screens/main/LoginScreen';
import SignupForm from './src/screens/main/SignupForm';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Setting" component={Settings} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="signup" component={SignupForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
