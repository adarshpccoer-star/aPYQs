import React, { useEffect, useState } from 'react';
import { Button, Text, Image, View, ActivityIndicator } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Keychain from 'react-native-keychain';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';

const API_URL = 'http://192.168.1.43:3000';
const KEYCHAIN_SERVICE = 'com.apyqs.auth';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

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

  const handleGithubLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const available = await InAppBrowser.isAvailable();

      if (!available) {
        throw new Error('InAppBrowser is not available');
      }

      const result = await InAppBrowser.openAuth(
        `${API_URL}/api/mobile/github`,
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
        throw new Error('No mobile authentication code received');
      }

      const response = await fetch(`${API_URL}/api/mobile/exchange`, {
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

      // This updates Zustand.
      // The useEffect above will then decide:
      // Profile -> if complete
      // SignupForm -> if incomplete
      setAuth(authUser);
    } catch (error) {
      console.error('AUTH: GitHub login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isRestoring) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Restoring session...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 24,
        justifyContent: 'center',
      }}
    >
      {user ? (
        <View style={{ alignItems: 'center', gap: 12 }}>
          {user.image && (
            <Image
              source={{ uri: user.image }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
              }}
            />
          )}

          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            {user.name || 'GitHub User'}
          </Text>

          <Text style={{ color: '#666' }}>{user.email}</Text>

          <View style={{ marginTop: 24 }}>
            <Button title="Logout" onPress={logout} color="#FF3B30" />
          </View>
        </View>
      ) : (
        <View style={{ gap: 16 }}>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Button title="Continue with GitHub" onPress={handleGithubLogin} />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
