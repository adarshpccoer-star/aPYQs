import React, { useEffect, useState } from 'react';
import {
  Text,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Keychain from 'react-native-keychain';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';

import { API_BASE_URL, KEYCHAIN_SERVICE } from '../../config/env';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [loginProvider, setLoginProvider] = useState<
    'github' | 'google' | null
  >(null);

  const navigation = useNavigation<any>();

  const user = useAuthStore(state => state.user);
  const isRestoring = useAuthStore(state => state.isRestoring);
  const setAuth = useAuthStore(state => state.setAuth);
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    if (!isRestoring && user) {
      const profileComplete =
        !!user.branchCode &&
        !!user.branchName &&
        user.yearOfGate !== null &&
        user.yearOfGate !== undefined;

      navigation.navigate(profileComplete ? 'Profile' : 'SignupForm');
    }
  }, [user, isRestoring, navigation]);

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    if (loading) return;

    setLoading(true);
    setLoginProvider(provider);

    try {
      const available = await InAppBrowser.isAvailable();

      if (!available) {
        throw new Error('InAppBrowser is not available');
      }

      const result = await InAppBrowser.openAuth(
        `${API_BASE_URL}/api/mobile/${provider}`,
        'apyqs://auth/callback',
        {
          ephemeralWebSession: false,
          showTitle: true,
          enableUrlBarHiding: true,
          enableDefaultShare: false,
        },
      );

      if (result.type !== 'success' || !result.url) {
        return;
      }

      const callbackUrl = new URL(result.url);
      const code = callbackUrl.searchParams.get('code');

      if (!code) {
        throw new Error(
          `No mobile authentication code received from ${provider}`,
        );
      }

      const response = await fetch(`${API_BASE_URL}/api/mobile/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Exchange failed with status ${response.status}: ${errorText}`,
        );
      }

      const data = await response.json();
      const { sessionToken, user: authUser } = data;

      if (!sessionToken || !authUser) {
        throw new Error('Invalid exchange response');
      }

      await Keychain.setGenericPassword('apyqs', sessionToken, {
        service: KEYCHAIN_SERVICE,
      });
      console.log(authUser);
      setAuth(authUser);
    } catch (error) {
      console.error(`AUTH: ${provider} login failed:`, error);
    } finally {
      setLoading(false);
      setLoginProvider(null);
    }
  };

  if (isRestoring) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-slate-900">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-3 text-base text-gray-200">
          Restoring session...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      {user ? (
        <View className="flex-1 justify-center items-center p-6">
          {user.image && (
            <Image
              source={{ uri: user.image }}
              className="w-22 h-22 rounded-full mb-4"
            />
          )}

          <Text className="text-2xl font-bold text-white">
            {user.name || 'User'}
          </Text>

          <Text className="text-gray-300 mt-1.5">{user.email}</Text>

          <View className="mt-7 w-full max-w-xs">
            <TouchableOpacity
              onPress={logout}
              className="bg-[#FF3B30] py-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold text-base">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="flex-1 justify-center px-6">
          <View className="bg-white rounded-3xl p-7 items-center shadow-lg">
            <Text className="text-4xl font-extrabold tracking-widest text-slate-900 mb-2">
              APYQS
            </Text>

            <Text className="text-xs text-gray-500 text-center leading-5 mb-7">
              Academic & Professional Youth Qualification System
            </Text>

            <Text className="text-lg font-semibold text-gray-800 mb-5">
              Sign in to continue
            </Text>

            {loading ? (
              <View className="items-center py-5">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="mt-3 text-gray-600">
                  Signing in with{' '}
                  {loginProvider === 'google' ? 'Google' : 'GitHub'}...
                </Text>
              </View>
            ) : (
              <View className="w-full gap-3">
                <TouchableOpacity
                  onPress={() => handleOAuthLogin('google')}
                  className="w-full bg-blue-600 py-3 rounded-lg items-center"
                >
                  <Text className="text-white font-semibold text-base">
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleOAuthLogin('github')}
                  className="w-full bg-gray-900 py-3 rounded-lg items-center"
                >
                  <Text className="text-white font-semibold text-base">
                    Continue with GitHub
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <Text className="mt-7 text-xs text-gray-500 text-center">
              Built for India's academic community
            </Text>

            <Text className="mt-1.5 text-[11px] text-gray-400 text-center">
              IITs • IISc • Research • Technology
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
